import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscountDTO } from '../dto/invoice/discount.dto';
import { InvoicesService } from '../services/invoices.service';

@ApiTags('invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('discount')
  @HttpCode(200)
  async getDiscount(@Body() invoiceDto: DiscountDTO): Promise<number> {
    return this.invoicesService.getDiscount(invoiceDto);
  }
}
