import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryService } from '../../category/services/category.service';
import { CreateCategoryDTO } from '../../category/dto/create-category.dto';
import { Category } from '../../entities/category.entity';
import { QueryCategory } from '../../category/dto/filter-category.dto';
import { Types } from 'mongoose';
import { UpdateCategoryDTO } from '../../category/dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryService: CategoryService) {}

  async create(modelDto: CreateCategoryDTO): Promise<Category> {
    try {
      return this.categoryService.create(modelDto);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async getCategoryList(queryParams: QueryCategory) {
    return this.categoryService.findAll(queryParams);
  }

  async updateCategory(_id: Types.ObjectId, modelData: UpdateCategoryDTO) {
    return this.categoryService.updateOne({ _id }, modelData);
  }

  async deleteCategory(_id: Types.ObjectId) {
    return this.categoryService.remove(_id);
  }
}
