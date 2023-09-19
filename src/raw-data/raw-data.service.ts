import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { RawData } from './schemas/raw-data.schema';
import { Readable } from 'stream';

@Injectable()
export class RawDataService {
  constructor(
    @InjectModel(RawData.name)
    private rawDataModel: mongoose.Model<RawData>,
  ) {}
  async findAll(): Promise<RawData[]> {
    const rawData = await this.rawDataModel.find();
    return rawData;
  }
  // async importData(fileBufferInBase64: string) {
  //   const buffer = Buffer.from(fileBufferInBase64, 'base64')
  //   const dataStream = Readable.from(buffer)
  //   const parsedCsv = parse(dataStream, {
  //      header: true,
  //      skipEmptyLines: true,
  //      complete: (results) => {
  //         console.log('results:', results)
  //      },
  //   })
  // }
}
