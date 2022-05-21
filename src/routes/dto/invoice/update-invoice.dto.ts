import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceDTO } from './create-invoice.dto';

export class UpdateInvoiceDTO extends PartialType(CreateInvoiceDTO) {}
