import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { LanguageEnum } from '../common/enums/language.enum';

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Invoice {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: Number, default: 0 })
  product: number;

  @Prop({ type: Number, default: 0 })
  amount: number;

  @Prop({ type: Number, default: 0 })
  discount: number;

  @Prop({ default: LanguageEnum.EN })
  language: LanguageEnum;

  _id?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export type InvoiceDocument = Invoice & Document;
export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
