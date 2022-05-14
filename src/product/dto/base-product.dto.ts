import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export class BaseProductDTO {
  @IsString()
  title: string;

  @IsNotEmpty()
  category: Types.ObjectId;

  @IsNumber()
  discount: number;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;
}
