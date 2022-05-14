import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateProductDTO } from './create-product.dto';
import { Pagination } from 'src/common/dto/pagination.dto';

export class FilterProductDTO extends PartialType(CreateProductDTO) {}

export class QueryProduct extends IntersectionType(
  Pagination,
  FilterProductDTO,
) {}
