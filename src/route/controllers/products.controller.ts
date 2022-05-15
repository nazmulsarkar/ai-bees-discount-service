import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateProductDTO } from '../../product/dto/create-product.dto';
import { QueryProduct } from '../../product/dto/filter-product.dto';
import { UpdateProductDTO } from '../../product/dto/update-product.dto';
import { ProductsService } from '../services/products.service';

@ApiTags('products')
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProdcut(@Body() createProductDto: CreateProductDTO) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async getProductList(@Query() queryParams: QueryProduct) {
    return this.productsService.getProductList(queryParams);
  }

  @Patch(':id')
  async updtaeProduct(
    @Param('id') id: Types.ObjectId,
    @Body() updateProductDTO: UpdateProductDTO,
  ) {
    return this.productsService.updateProduct(id, updateProductDTO);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: Types.ObjectId) {
    return this.productsService.deleteProduct(id);
  }
}
