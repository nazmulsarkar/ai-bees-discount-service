import { Types } from 'mongoose';
import { IsOptional, IsString } from 'class-validator';

export class FilterSessionDTO {
  @IsOptional()
  userId: Types.ObjectId;

  @IsString()
  refreshToken: string;
}
