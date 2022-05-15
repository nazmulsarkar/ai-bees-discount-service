import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductService } from '../../product/services/product.service';
import { Discount } from '../dto/invoice/discount.dto';
import { Category } from 'src/entities/category.entity';

@Injectable()
export class InvoicesService {
  constructor(private readonly productService: ProductService) {}

  async getDiscount(filter: Discount): Promise<number> {
    let discount = -1;
    try {
      const product = await this.productService.findOneByDiscountInout({
        ...filter,
      });
      if (product && product.discount > 0) {
        discount = product.discount;
        return discount;
      }
      if (product && product.category) {
        let parent = product.category as Category;

        if (parent && parent.discount > 0) {
          discount = parent.discount;
          return discount;
        }
        if (parent && parent.parent) {
          parent = product.category as Category;
          if (parent && parent.discount > 0) {
            discount = parent.discount;
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
