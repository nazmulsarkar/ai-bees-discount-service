import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from '../../entities/product.entity';
import { QueryProduct } from '../dto/filter-product.dto';
import { UpdateProductDTO } from '../dto/update-product.dto';
import { ErrorMessage } from '../../common/dto/error-message.dto';
import { QueryResponse } from '../../common/dto/query-response.dto';
import { Discount } from '../../route/dto/invoice/discount.dto';
import { populateCategoryFields } from 'src/common/constants/populate-fields.const';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async findAll(queryParams: QueryProduct) {
    const response = new QueryResponse<Product>();
    const { limit, page, ...rest } = queryParams;

    const filter = rest || {};
    const filterQry = this.buildQuery(filter);

    const size = limit || 100;
    const skip = page ? page - 1 : 0;

    const sortsQry = [{ property: 'createdAt', direction: -1 }];
    const sort = {};
    sortsQry.map((s) => {
      sort[s.property] = s.direction;
    });

    try {
      response.totalCount = await this.productModel.countDocuments({
        ...filterQry,
      });

      const list = await this.productModel
        .find({
          ...filterQry,
        })
        .sort(sort)
        .skip(skip * size)
        .limit(size)
        .populate({
          path: 'productId',
          select: ['_id', 'isActive', 'email'],
        })
        .exec();

      response.data = list || [];
      response.success = list ? true : false;

      return response;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async create(createModel: Partial<Product>): Promise<Product> {
    try {
      return this.productModel.create(createModel);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  async findOne(filter: Partial<Product>) {
    const data = await this.productModel.findOne({ ...filter }).exec();
    if (!data) {
      throw new NotFoundException(
        new ErrorMessage({
          code: `product_not_found`,
          message: `Product not found`,
        }),
      );
    }
    return data;
  }

  async updateOne(filter: Partial<Product>, updateModel: UpdateProductDTO) {
    const res = await this.productModel
      .findOneAndUpdate({ ...filter }, updateModel, { new: true })
      .exec();

    if (!res) {
      throw new BadRequestException(
        new ErrorMessage({
          code: `product_not_updated`,
          message: `Product couldn't be updated!`,
        }),
      );
    }

    return res;
  }

  buildQuery(filter: QueryProduct) {
    const filterQuery = {
      ...filter,
    };
    return filterQuery;
  }

  async remove(_id: Types.ObjectId) {
    const { deletedCount } = await this.productModel.deleteOne({ _id });
    if (!deletedCount) {
      throw new NotFoundException(
        new ErrorMessage({
          code: `product_not_found`,
          message: `Product couldn't be found!`,
        }),
      );
    }
    return {
      success: true,
    };
  }

  async findOneByDiscountInout(filter: Discount) {
    const data = await this.productModel
      .findOne({ ...filter })
      .populate({
        path: 'category',
        select: populateCategoryFields,
        populate: {
          path: 'parent',
          select: populateCategoryFields,
          populate: {
            path: 'parent',
            select: populateCategoryFields,
            populate: {
              path: 'parent',
              select: populateCategoryFields,
            },
          },
        },
      })
      .exec();
    if (!data) {
      throw new NotFoundException(
        new ErrorMessage({
          code: `product_not_found`,
          message: `Product not found`,
        }),
      );
    }
    return data;
  }
}
