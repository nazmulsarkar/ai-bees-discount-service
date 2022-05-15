import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductService } from '../../product/services/product.service';
import { CategoryService } from '../../category/services/category.service';
import { Types } from 'mongoose';
import { Discount } from '../dto/invoice/discount.dto';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  async getDiscount(filter: Discount): Promise<number> {
    let discount = -1;
    try {
      const product = await this.productService.findOneDiscountInout({
        ...filter,
      });
      if (product && product.discount > 0) {
        discount = product.discount;
        return discount;
      }
      discount = await this.categoryService.getCategoryDiscount({
        _id: product.category as Types.ObjectId,
      });
      return discount;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
