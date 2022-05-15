import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryService } from '../../category/services/category.service';
import { CreateCategoryDTO } from '../../category/dto/create-category.dto';
import { Category } from '../../entities/category.entity';

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
}
