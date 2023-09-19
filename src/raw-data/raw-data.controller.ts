import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RawDataService } from './raw-data.service';
import { RawData } from './schemas/raw-data.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Papa from 'papaparse';

@Controller('raw-data')
export class RawDataController {
  constructor(private rawDataService: RawDataService) {}
  @Get()
  async getAllRawData(): Promise<RawData[]> {
    return this.rawDataService.findAll();
  }
  // @Post()
  // @UseInterceptors(FileInterceptor("file"))
  // importUsers(@UploadedFile() file: Express.Multer.File) {
  //   return this.rawDataService.importData(file.buffer.toString('base64')
  // }
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const results = [];

    Papa.parse(file.buffer.toString(), {
      header: true, // Jika baris pertama adalah header
      dynamicTyping: true, // Otomatis mendeteksi tipe data
      skipEmptyLines: true, // Melewati baris kosong
      step: (result) => {
        if (result.data) {
          console.log(result.data);
          // Handle data dari file CSV
          // Pastikan data yang diunggah sesuai dengan model RawData
          // const rawData = new this.rawDataModel(result.data);
          // rawData.save(); // Simpan data ke dalam koleksi "raw_data"
          // results.push(rawData);
        }
      },
      complete: () => {
        // Proses selesai
        results.push({ message: 'Success' });
      },
    });

    return results;
  }
}
