import { Type } from 'class-transformer';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class FilterVerificationDTO {
  @IsOptional()
  @Type(() => Types.ObjectId)
  _id?: Types.ObjectId;

  @IsOptional()
  @Type(() => Types.ObjectId)
  modelId?: Types.ObjectId;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsDateString()
  expiry?: Date;
}
