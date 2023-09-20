import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  collection: 'raw_data',
})
export class RawData {
  @Prop()
  unique: string;

  @Prop()
  resultTime: Date;

  @Prop()
  enodebId: string;

  @Prop()
  cellId: string;

  @Prop()
  availDur: number;
}

export const RawDataSchema = SchemaFactory.createForClass(RawData);
