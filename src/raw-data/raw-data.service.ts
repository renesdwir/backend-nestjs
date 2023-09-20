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
  async findOne(unique: string): Promise<RawData> {
    const rawData = await this.rawDataModel.findOne({ unique });
    return rawData;
  }
  async create(rawData: RawData): Promise<RawData> {
    const newRaw = await this.rawDataModel.create(rawData);
    return newRaw;
  }
}
