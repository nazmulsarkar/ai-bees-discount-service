import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category } from '../../entities/category.entity';
import { QueryCategory } from '../dto/filter-category.dto';
import { UpdateCategoryDTO } from '../dto/update-category.dto';
import { ErrorMessage } from '../../common/dto/error-message.dto';
import { QueryResponse } from '../../common/dto/query-response.dto';
import { populateCategoryFields } from '../../common/constants/populate-fields.const';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async findAll(queryParams: QueryCategory) {
    const response = new QueryResponse<Category>();
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
      response.totalCount = await this.categoryModel.countDocuments({
        ...filterQry,
      });

      const list = await this.categoryModel
        .find({
          ...filterQry,
        })
        .sort(sort)
        .skip(skip * size)
        .limit(size)
        .populate({
          path: 'parent',
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

      response.data = list || [];
      response.success = list ? true : false;

      return response;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  private calculateCategoryDiscount(
    categories: Category[],
    filter: Partial<Category>,
  ): number {
    let discount = -1;
    if (!(categories.length > 0)) {
      return discount;
    }
    const productCategory = categories.filter(
      (c) => String(c._id) === String(filter._id),
    )[0];

    if (!productCategory && !(productCategory.discount > 0)) {
      return discount;
    }

    discount = productCategory.discount;

    for (const category of categories) {
      if (
        String(productCategory._id) === String(category._id) &&
        category.discount > 0
      ) {
        discount = category.discount;
        return discount;
      }
      this.calculateCategoryDiscount(categories, category);
    }

    return discount;
  }

  async getCategoryDiscount(filter: Partial<Category>) {
    let categoryDiscount = -1;
    const categories = await this.categoryModel.find();
    categoryDiscount = this.calculateCategoryDiscount(categories, filter);
    return categoryDiscount;
  }

  async create(createModel: Partial<Category>): Promise<Category> {
    try {
      return this.categoryModel.create(createModel);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  async findOne(filter: Partial<Category>) {
    const data = await this.categoryModel.findOne({ ...filter }).exec();
    if (!data) {
      throw new NotFoundException(
        new ErrorMessage({
          code: `category_not_found`,
          message: `Category not found`,
        }),
      );
    }
    return data;
  }

  async updateOne(filter: Partial<Category>, updateModel: UpdateCategoryDTO) {
    const res = await this.categoryModel
      .findOneAndUpdate({ ...filter }, updateModel, { new: true })
      .exec();

    if (!res) {
      throw new BadRequestException(
        new ErrorMessage({
          code: `category_not_updated`,
          message: `Category couldn't be updated!`,
        }),
      );
    }

    return res;
  }

  buildQuery(filter: QueryCategory) {
    const filterQuery = {
      ...filter,
    };
    return filterQuery;
  }

  async remove(_id: Types.ObjectId) {
    const { deletedCount } = await this.categoryModel.deleteOne({ _id });
    if (!deletedCount) {
      throw new NotFoundException(
        new ErrorMessage({
          code: `category_not_found`,
          message: `Category couldn't be found!`,
        }),
      );
    }
    return {
      success: true,
    };
  }
}
