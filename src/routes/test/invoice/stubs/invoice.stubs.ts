import { Types } from 'mongoose';
import { DiscountResponse } from '../../../../common/dto/discount-response.dto';
import { DiscountInEnum } from '../../../../common/enums/discount-in.enum';
import { DiscountDTO } from '../../../dto/invoice/discount.dto';

export const discount = (): DiscountResponse => ({
  discount: -1,
  amount: 1000,
  discountIn: DiscountInEnum.PERCENTAGE,
  discuntedAmount: 950,
});

export const discountDto = (): DiscountDTO => ({
  amount: 1000,
  productId: new Types.ObjectId('6280bc0033c3e8cceb249e5c'),
  productTitle: `Product two`,
});
