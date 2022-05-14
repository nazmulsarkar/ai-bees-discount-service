import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';
import { Pagination } from '../../common/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class FilterUserDTO extends PartialType(CreateUserDTO) {
  @IsOptional()
  @IsString()
  name?: string;
}

export class QueryUser extends IntersectionType(Pagination, FilterUserDTO) {}
