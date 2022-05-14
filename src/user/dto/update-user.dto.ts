import { PartialType } from '@nestjs/mapped-types';
import {
  IsOptional,
  IsDate,
  IsNumber,
  IsPositive,
  IsBoolean,
} from 'class-validator';
import { Types } from 'mongoose';
import { CreateUserDTO } from './create-user.dto';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @IsOptional()
  @IsDate()
  lastLoginTime?: Date;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  loginCount?: number;
}

export class UpdateActiveStatusDTO {
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
export class UpdateActiveStatus extends UpdateActiveStatusDTO {
  @IsOptional()
  userId?: Types.ObjectId;
}
