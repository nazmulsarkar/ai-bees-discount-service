import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCategoryDTO } from 'src/category/dto/create-category.dto';
import { CategoriesService } from '../services/categories.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiTags('categories')
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDTO) {
    return this.categoriesService.create(createCategoryDto);
  }
}
