import { Locale } from './dto/locale.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UpdateActiveStatus } from './dto/update-user.dto';
import { Types } from 'mongoose';
import { User } from '../entities/user.entity';
import { QueryUser } from './dto/filter-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { ErrorMessage } from '../common/dto/error-message.dto';
import { QueryResponse } from '../common/dto/query-response.dto';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  async findAll(queryParams: QueryUser, userId: Types.ObjectId) {
    const response = new QueryResponse<User>();
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
      response.totalCount = await this.userModel.countDocuments({
        ...filterQry,
        userId: { $ne: userId },
      });

      const list = await this.userModel
        .find({
          ...filterQry,
          userId: { $ne: userId },
        })
        .sort(sort)
        .skip(skip * size)
        .limit(size)
        .populate({
          path: 'userId',
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

  async create(createModel: Partial<User>): Promise<User> {
    try {
      return this.userModel.create(createModel);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  async findOne(filter: Partial<User>) {
    const data = await this.userModel.findOne({ ...filter }).exec();
    if (!data) {
      throw new NotFoundException(
        new ErrorMessage({
          code: `user_not_found`,
          message: `User not found`,
        }),
      );
    }
    return data;
  }

  async getUserMe(userId: Types.ObjectId): Promise<Partial<User>> {
    try {
      const data = await this.findOne({ _id: userId });
      delete data.password;
      return data;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async updateOne(filter: Partial<User>, updateModel: UpdateUserDTO) {
    const res = await this.userModel
      .findOneAndUpdate({ ...filter }, updateModel, { new: true })
      .exec();

    if (!res) {
      throw new BadRequestException(
        new ErrorMessage({
          code: `user_not_updated`,
          message: `User couldn't be updated!`,
        }),
      );
    }

    return res;
  }

  async updateLoginStats(filter: Partial<User>) {
    const updateModel = {
      $inc: { loginCount: 1 },
      lastLoginTime: new Date(),
    };
    return this.updateOne({ ...filter }, updateModel);
  }

  buildQuery(filter: QueryUser) {
    const filterQuery = {
      ...filter,
      ...(filter.name
        ? {
            $or: [
              { firstName: { $regex: filter.name, $options: 'i' } },
              { lastName: { $regex: filter.name, $options: 'i' } },
            ],
          }
        : {}),
    };
    delete filterQuery.name;
    return filterQuery;
  }

  async updateUserMe(user: JwtPayload, updateModel: UpdateUserDTO) {
    return this.updateOne({ _id: user._id }, updateModel);
  }

  async updateActiveStatus({
    userId,
    updateModel,
  }: {
    userId: Types.ObjectId;
    updateModel: UpdateActiveStatus;
  }) {
    try {
      return this.updateOne({ _id: userId }, { ...updateModel });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async changeLocale(locale: Locale) {
    const response = {
      success: true,
      message: `Current language changed to ${locale.language}!`,
    };

    try {
      const updated = await this.updateOne(
        { _id: locale.userId },
        { language: locale.language },
      );

      response.success = updated ? true : false;
      response.message = updated
        ? `Current language changed to ${locale.language}!`
        : `Current language couldn't be changed!`;
      return response;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async remove(_id: Types.ObjectId) {
    const { deletedCount } = await this.userModel.deleteOne({ _id });
    if (!deletedCount) {
      throw new NotFoundException(
        new ErrorMessage({
          code: `user_not_found`,
          message: `User couldn't be found!`,
        }),
      );
    }
    return {
      success: true,
    };
  }
}
