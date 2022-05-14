import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscountDTO } from './dto/discount.dto';
import { InvoiceService } from './services/invoice.service';

@ApiTags('invoices')
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('discount')
  @HttpCode(200)
  async getDiscount(@Body() invoiceDto: DiscountDTO): Promise<number> {
    return this.invoiceService.getDiscount(invoiceDto);
  }
}
