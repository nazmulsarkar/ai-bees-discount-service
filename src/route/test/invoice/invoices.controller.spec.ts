import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from '../../controllers/invoices.controller';
import { InvoicesService } from '../../services/invoices.service';
import { CategoryModule } from '../../../category/category.module';
import { ProductModule } from '../../../product/product.module';
import { CategoriesService } from '../../../route/services/categories.service';
import { ProductsService } from '../../../route/services/products.service';
import { DiscountDTO } from '../../../route/dto/invoice/discount.dto';
import { DiscountResponse } from '../../../common/dto/discount-response.dto';
import { discountDto } from './stubs/invoice.stubs';

jest.mock('../../../route/services/products.service');
jest.mock('../../../route/services/categories.service');

describe('InvoicesController', () => {
  let invoicesController: InvoicesController;
  let invoicesService: InvoicesService;

  beforeEach(async () => {
    jest.resetModules();

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [CategoryModule, ProductModule],
      controllers: [InvoicesController],
      providers: [CategoriesService, ProductsService, InvoicesService],
    }).compile();

    invoicesController = moduleRef.get<InvoicesController>(InvoicesController);
    invoicesService = moduleRef.get<InvoicesService>(InvoicesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(invoicesController).toBeDefined();
    expect(invoicesService).toBeDefined();
  });

  describe('getDiscount', () => {
    describe('when getDiscount is called', () => {
      let discountResponse: DiscountResponse;
      let discountResponseFromService: DiscountResponse;
      let discountInput: DiscountDTO;

      beforeEach(async () => {
        discountInput = {
          ...discountDto(),
        };

        discountResponse = await invoicesController.getDiscount(discountInput);
        discountResponseFromService = await invoicesService.getDiscount(
          discountInput,
        );
      });

      test('then it should call service', () => {
        expect(invoicesService.getDiscount).toBeCalledWith(discountDto);
      });

      test('then it should return success response', () => {
        expect(discountResponse).toEqual(discountResponseFromService);
      });
    });
  });
});
