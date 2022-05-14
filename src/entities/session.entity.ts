import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';
import { User } from './user.entity';

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Session {
  _id?: Types.ObjectId;

  @Prop({
    unique: true,
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
  })
  userId: Types.ObjectId;

  @Prop({
    unique: true,
    required: true,
    type: String,
  })
  refreshToken: string;
}
export const SessionSchema = SchemaFactory.createForClass(Session);
SessionSchema.plugin(uniqueValidator);
