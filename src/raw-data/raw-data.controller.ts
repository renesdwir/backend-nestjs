import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RawDataService } from './raw-data.service';
import { RawData } from './schemas/raw-data.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Papa from 'papaparse';
import * as path from 'path';

@Controller('raw-data')
export class RawDataController {
  constructor(private rawDataService: RawDataService) {}
  @Get()
  async getAllRawData(): Promise<RawData[]> {
    return this.rawDataService.findAll();
  }
  @Post()
  @UseInterceptors(FileInterceptor('files'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      await new Promise<void>((resolve, reject) => {
        if (path.extname(file.originalname) !== '.csv') {
          reject(
            new BadRequestException(
              'File yang diinput harus ber-ekstensi .csv',
              'FileExtensionError',
            ),
          );
        }
        Papa.parse(file.buffer.toString(), {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: async (result) => {
            if (result.data && result.data.length > 0) {
              let flag = 0;
              for (const row of result.data) {
                let obj = {
                  unique: '',
                  resultTime: new Date(),
                  enodebId: '',
                  cellId: '',
                  availDur: 0,
                };
                if (
                  row['Object Name'] &&
                  row['Result Time'] &&
                  row['L.Cell.Avail.Dur']
                ) {
                  let pieces = row['Object Name'].split(',');
                  let enodebIDPiece = pieces.find(function (piece: string) {
                    return piece.includes('eNodeB ID');
                  });
                  let cellIDPiece = pieces.find(function (piece: string) {
                    return piece.includes('Local Cell ID');
                  });

                  if (enodebIDPiece && cellIDPiece) {
                    let enodebID = enodebIDPiece.split('=')[1];
                    let cellID = cellIDPiece.split('=')[1];
                    obj.unique =
                      enodebID + '-' + cellID + '-' + row['Result Time'];
                    obj.enodebId = enodebID;
                    obj.cellId = cellID;
                    obj.resultTime = new Date(row['Result Time']);
                    obj.availDur = row['L.Cell.Avail.Dur'];
                  } else {
                    console.log(
                      'Tidak ada eNodeB ID / result time / l.cell.avail.dur yang ditemukan.',
                    );
                  }

                  const existingData = await this.rawDataService.findOne(
                    obj.unique,
                  );
                  if (!existingData) {
                    await this.rawDataService.create(obj);
                  }
                } else {
                  flag += 1;
                  if (flag > 1) {
                    reject(
                      new BadRequestException(
                        'Data dalam file tidak sesuai',
                        'Mismatched Data',
                      ),
                    );
                  }
                }
              }
            }

            resolve();
          },
          error: (error: any) => {
            console.error('Error parsing CSV:', error);
            reject(
              new InternalServerErrorException(
                'Terjadi kesalahan dalam mengurai file CSV',
                'CsvParsingError',
              ),
            );
          },
        });
      });

      return { message: 'Data berhasil ditambahkan .' };
    } catch (error) {
      throw error;
    }
  }

  @Get('graph')
  async getGraph(
    @Query('enodebId') enodebId: string,
    @Query('cellId') cellId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    try {
      let startDateObj;
      let endDateObj;
      if (startDate && endDate) {
        startDateObj = new Date(startDate);
        endDateObj = new Date(endDate);
        if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
          return { error: 'Invalid date format' };
        }
      }

      const rawData = await this.rawDataService.find(
        enodebId,
        cellId,
        startDateObj,
        endDateObj,
      );

      const graphData = rawData.map((item) => ({
        resultTime: item.resultTime,
        availability: (item.availDur / 900) * 100,
      }));

      return graphData;
    } catch (error) {
      return { error: 'An error occurred' };
    }
  }
}
