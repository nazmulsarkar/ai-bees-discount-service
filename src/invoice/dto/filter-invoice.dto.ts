import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceDTO } from './create-invoice.dto';
import { Pagination } from '../../common/dto/pagination.dto';

export class FilterInvoiceDTO extends PartialType(CreateInvoiceDTO) {}

export class QueryInvoice extends IntersectionType(
  Pagination,
  FilterInvoiceDTO,
) {}
