import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';
import { Document, Types } from 'mongoose';
import { Role } from '../common/enums/role.enum';
import { LanguageEnum } from '../common/enums/language.enum';
import Language from '../common/types/language.type';

@Schema({
  timestamps: true,
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class User {
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ required: true })
  roles: Role[];

  @Prop({ type: Number, default: 0 })
  loginCount: number;

  @Prop({ type: Date, default: null })
  lastLoginTime: Date;

  @Prop({ type: Boolean, default: false })
  isEmailVerified?: boolean;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;

  @Prop({ type: Language, default: LanguageEnum.EN })
  language: LanguageEnum;

  _id?: Types.ObjectId;
  displayName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(uniqueValidator);

UserSchema.virtual('displayName').get(function (u) {
  return `${u.firstName} ${u.lastName}`.trim();
});
