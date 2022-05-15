import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductService } from '../../product/services/product.service';
import { CreateProductDTO } from '../../product/dto/create-product.dto';
import { Product } from '../../entities/product.entity';
import { QueryProduct } from '../../product/dto/filter-product.dto';
import { UpdateProductDTO } from '../../product/dto/update-product.dto';
import { Types } from 'mongoose';

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

  async getProductList(queryParams: QueryProduct) {
    return this.productService.findAll(queryParams);
  }

  async updateProduct(_id: Types.ObjectId, modelData: UpdateProductDTO) {
    return this.productService.updateOne({ _id }, modelData);
  }

  async deleteProduct(_id: Types.ObjectId) {
    return this.productService.remove(_id);
  }
}
