import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';
import * as dayjs from 'dayjs';
import { User } from './user.entity';

const verifyCode = () => Math.floor(1000 + Math.random() * 9000).toString();

@Schema({ timestamps: true })
export class Verification {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    unique: true,
    ref: User.name,
  })
  user: Types.ObjectId | User;

  @Prop({ type: {} as any, default: null })
  data?: any;

  @Prop({
    type: String,
    default: verifyCode(),
  })
  code: string;

  @Prop({
    type: Date,
    default: dayjs().add(30, 'minute').toDate(),
  })
  expiry: Date;

  _id?: Types.ObjectId;
}

export type VerificationDocument = Verification & Document;
export const VerificationSchema = SchemaFactory.createForClass(Verification);
VerificationSchema.plugin(uniqueValidator);
