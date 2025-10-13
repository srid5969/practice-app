import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Board  {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 'default-user' })
  owner: string; // later can be linked to User schema
}

export const BoardSchema = SchemaFactory.createForClass(Board);
