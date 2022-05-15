import { Module } from '@nestjs/common';
import { ProductModule } from '../product/product.module';
import { CategoryModule } from '../category/category.module';
import { CategoriesController } from './controllers/categories.controller';
import { InvoicesController } from './controllers/invoices.controller';
import { ProductsController } from './controllers/products.controller';
import { CategoriesService } from './services/categories.service';
import { InvoicesService } from './services/invoices.service';
import { ProductsService } from './services/products.service';

@Module({
  imports: [CategoryModule, ProductModule],
  controllers: [CategoriesController, ProductsController, InvoicesController],
  providers: [CategoriesService, ProductsService, InvoicesService],
})
export class RouteModule {}
