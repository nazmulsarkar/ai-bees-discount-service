import { Module } from '@nestjs/common';
import { ProductModule } from 'src/product/product.module';
import { CategoryModule } from '../category/category.module';
import { CategoriesController } from './controllers/categories.controller';
import { InvoicesController } from './controllers/invoices.controller';
import { CategoriesService } from './services/categories.service';
import { InvoicesService } from './services/invoices.service';

@Module({
  imports: [CategoryModule, ProductModule],
  controllers: [CategoriesController, InvoicesController],
  providers: [CategoriesService, InvoicesService],
})
export class RouteModule {}
