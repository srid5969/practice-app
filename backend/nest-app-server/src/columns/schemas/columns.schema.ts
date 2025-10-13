import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Column  {
  @Prop({ required: true })
  title: string;

  @Prop({ default: 0 })
  order: number; // column ordering inside board

  @Prop({ type: Types.ObjectId, ref: 'Board', required: true })
  boardId: Types.ObjectId;
}

export const ColumnSchema = SchemaFactory.createForClass(Column);
