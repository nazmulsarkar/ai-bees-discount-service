import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductService } from 'src/product/services/product.service';
import { CreateProductDTO } from 'src/product/dto/create-product.dto';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly productService: ProductService) {}

  async create(modelDto: CreateProductDTO): Promise<Product> {
    try {
      return this.productService.create(modelDto);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
