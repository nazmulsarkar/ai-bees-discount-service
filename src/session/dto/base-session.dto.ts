import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class BaseSessionDTO {
  @IsOptional()
  _id?: Types.ObjectId;

  @IsNotEmpty()
  userId: Types.ObjectId;

  @IsString()
  refreshToken: string;
}
