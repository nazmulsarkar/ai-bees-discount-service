import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateVerificationDTO } from './dto/create-verification.dto';
import { FilterVerificationDTO } from './dto/filter-verification.dto';
import { Verification } from '../entities/verification.entity';

@Injectable()
export class VerificationService {
  constructor(
    @InjectModel(Verification.name)
    private readonly verifyModel: Model<Verification>,
  ) {}

  async findOne(filter: FilterVerificationDTO) {
    const verifiedData = await this.verifyModel
      .findOne({ ...filter })
      .populate({
        path: 'user',
        select: ['_id', 'email', 'isActive', 'isEmailVerified'],
      });

    if (!verifiedData) {
      throw new BadRequestException(`Couldn't verify the provided code!`);
    }
    return verifiedData;
  }

  async create(createVerificationDTO: CreateVerificationDTO) {
    const verification = await this.verifyModel
      .findOneAndUpdate(
        {
          user: createVerificationDTO.user,
        },
        {
          ...new CreateVerificationDTO(),
          ...createVerificationDTO,
        },
        { new: true, upsert: true },
      )
      .exec();

    if (!verification) {
      throw new BadRequestException(`Couldn't create the verification code`);
    }
    return verification;
  }

  async removeById(id: Types.ObjectId) {
    const response = {} as any;
    const removed = await this.verifyModel.findByIdAndRemove(id);
    response.success = removed ? true : false;
    response.message = removed
      ? `The verification doc removed successfully!`
      : `There is an error. Please try later!`;
    return response;
  }
}
