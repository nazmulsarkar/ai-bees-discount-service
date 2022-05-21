import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from '../../services/invoices.service';
import { InvoicesController } from '../../controllers/invoices.controller';
import { CategoryModule } from '../../../category/category.module';
import { ProductModule } from '../../../product/product.module';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';
import { DiscountResponse } from '../../../common/dto/discount-response.dto';
import { Discount } from '../../dto/invoice/discount.dto';
import { ProductService } from '../../../product/services/product.service';
import { discountDto } from './stubs/invoice.stubs';

jest.mock('../../controllers/invoices.controller');
jest.mock('../../../route/services/products.service');
jest.mock('../../../product/services/product.service');
jest.mock('../../../route/services/categories.service');

describe('InvoicesService', () => {
  let invoicesService: InvoicesService;
  let productService: ProductService;

  beforeEach(async () => {
    jest.resetModules();

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [CategoryModule, ProductModule],
      controllers: [InvoicesController],
      providers: [CategoriesService, ProductsService, InvoicesService],
    }).compile();
    invoicesService = moduleRef.get<InvoicesService>(InvoicesService);
    productService = moduleRef.get<ProductService>(ProductService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(invoicesService).toBeDefined();
  });

  describe('getDiscount', () => {
    describe('when getDiscount is called', () => {
      let discountResponse: DiscountResponse;
      let discountResponseFromService: DiscountResponse;
      let discountInput: Discount;

      beforeEach(async () => {
        discountInput = {
          ...discountDto(),
        };

        discountResponseFromService = await invoicesService.getDiscount(
          discountInput,
        );
      });

      test('then it should call service', () => {
        expect(productService.findOneByDiscountInput).toBeCalledWith(
          discountInput,
        );
      });

      test('then it should return success response', () => {
        expect(discountResponse).toEqual(discountResponseFromService);
      });
    });
  });
});
