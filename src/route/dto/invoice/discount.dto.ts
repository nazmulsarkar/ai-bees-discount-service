import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class DiscountDTO {
  @IsOptional()
  @IsNotEmpty()
  productId?: Types.ObjectId;

  @IsOptional()
  @IsString()
  productTitle?: string;

  @IsNumber()
  amount: number;
}
export class Discount extends DiscountDTO {
  @IsOptional()
  userId?: Types.ObjectId;
}
