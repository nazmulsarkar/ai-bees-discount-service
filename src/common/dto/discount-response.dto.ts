import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { DiscountInEnum } from '../enums/discount-in.enum';

export interface IDiscountResponse {
  discount: number;
  amount: number;
  discuntedAmount?: number;
  discountIn: DiscountInEnum;
}

export class DiscountResponse implements IDiscountResponse {
  @IsNumber()
  discount: number;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  discuntedAmount: number;

  @IsEnum(DiscountInEnum)
  discountIn = DiscountInEnum.PERCENTAGE;

  constructor(arg?: IDiscountResponse) {
    this.discount = arg?.discount;
    this.amount = arg?.amount;
    this.discuntedAmount = arg?.discuntedAmount;
    this.discountIn = arg?.discountIn;
  }
}
