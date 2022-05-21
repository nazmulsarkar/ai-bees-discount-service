import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class BaseInvoiceDTO {
  @IsString()
  title: string;

  @IsOptional()
  parent?: Types.ObjectId;

  @IsNumber()
  discount: number;
}
