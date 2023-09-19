import { Module } from '@nestjs/common';
import { RawDataController } from './raw-data.controller';
import { RawDataService } from './raw-data.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RawDataSchema } from './schemas/raw-data.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'RawData', schema: RawDataSchema }]),
  ],
  controllers: [RawDataController],
  providers: [RawDataService],
})
export class RawDataModule {}
