import { Type } from 'class-transformer';
import { IsDate, IsObject, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import * as dayjs from 'dayjs';
import { User } from '../../entities/user.entity';

const verifyCode = () => Math.floor(1000 + Math.random() * 9000).toString();

export class CreateVerificationDTO {
  @IsOptional()
  @Type(() => Types.ObjectId)
  _id?: Types.ObjectId;

  @Type(() => Types.ObjectId)
  user: Types.ObjectId | User;

  @IsOptional()
  @IsObject()
  data?: any;

  @IsOptional()
  @IsString()
  code?: string = verifyCode();

  @IsOptional()
  @IsDate()
  expiry?: Date = dayjs().add(30, 'minute').toDate();
}
