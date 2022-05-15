import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscountResponse } from 'src/common/dto/discount-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { DiscountDTO } from '../dto/invoice/discount.dto';
import { InvoicesService } from '../services/invoices.service';

@ApiTags('invoices')
@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('discount')
  @HttpCode(200)
  async getDiscount(
    @Body() invoiceDto: DiscountDTO,
  ): Promise<DiscountResponse> {
    return this.invoicesService.getDiscount(invoiceDto);
  }
}
