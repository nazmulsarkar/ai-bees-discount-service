import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDTO } from './create-category.dto';
import { Pagination } from '../../common/dto/pagination.dto';

export class FilterCategoryDTO extends PartialType(CreateCategoryDTO) {}

export class QueryCategory extends IntersectionType(
  Pagination,
  FilterCategoryDTO,
) {}
