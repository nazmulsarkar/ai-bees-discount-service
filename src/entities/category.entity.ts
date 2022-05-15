import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Category {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Category.name,
    default: null,
  })
  parent: Types.ObjectId | Category;

  @Prop({ type: Number, default: 0 })
  discount: number;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  _id?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CategoryDocument = Category & Document;
export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.plugin(uniqueValidator);
