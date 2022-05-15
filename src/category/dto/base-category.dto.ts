import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class BaseCategoryDTO {
  @IsString()
  title: string;

  @IsOptional()
  parent?: Types.ObjectId;

  @IsOptional()
  @IsNumber()
  discount?: number;
}
