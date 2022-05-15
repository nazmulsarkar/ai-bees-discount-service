import { IsString, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class DiscountDTO {
  @IsOptional()
  productId?: Types.ObjectId;

  @IsOptional()
  @IsString()
  productTitle?: string;
}
export class Discount extends DiscountDTO {
  @IsOptional()
  userId?: Types.ObjectId;
}
