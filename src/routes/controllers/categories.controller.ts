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
import { UpdateCategoryDTO } from '../../category/dto/update-category.dto';
import { CreateCategoryDTO } from '../../category/dto/create-category.dto';
import { QueryCategory } from '../../category/dto/filter-category.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CategoriesService } from '../services/categories.service';

@ApiTags('categories')
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDTO) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async getCategoryList(@Query() queryParams: QueryCategory) {
    return this.categoriesService.getCategoryList(queryParams);
  }

  @Patch(':id')
  async updtaeCategory(
    @Param('id') id: Types.ObjectId,
    @Body() updateCategoryDTO: UpdateCategoryDTO,
  ) {
    return this.categoriesService.updateCategory(id, updateCategoryDTO);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: Types.ObjectId) {
    return this.categoriesService.deleteCategory(id);
  }
}
