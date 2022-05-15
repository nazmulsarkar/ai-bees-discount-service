import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductService } from '../../product/services/product.service';
import { Discount } from '../dto/invoice/discount.dto';
import { Category } from 'src/entities/category.entity';
import { DiscountResponse } from 'src/common/dto/discount-response.dto';
import { DiscountInEnum } from 'src/common/enums/discount-in.enum';

@Injectable()
export class InvoicesService {
  constructor(private readonly productService: ProductService) {}

  async getDiscount(filter: Discount): Promise<DiscountResponse> {
    const discount: DiscountResponse = new DiscountResponse({
      discount: -1,
      amount: filter.amount,
      discountIn: DiscountInEnum.PERCENTAGE,
      discuntedAmount: filter.amount,
    });

    try {
      const product = await this.productService.findOneByDiscountInput({
        ...filter,
      });
      if (product && product.discount > 0) {
        discount.discount = product.discount;
        discount.discuntedAmount =
          filter.amount - (product.discount / 100) * filter.amount;
        return discount;
      }
      if (product && product.category) {
        let parent = product.category as Category;

        if (parent && parent.discount > 0) {
          discount.discount = parent.discount;
          discount.discuntedAmount =
            filter.amount - (product.discount / 100) * filter.amount;
          return discount;
        }
        if (parent && parent.parent) {
          parent = product.category as Category;
          if (parent && parent.discount > 0) {
            discount.discount = parent.discount;
            discount.discuntedAmount =
              filter.amount - (product.discount / 100) * filter.amount;
            return discount;
          }
        }
      }
      return discount;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
