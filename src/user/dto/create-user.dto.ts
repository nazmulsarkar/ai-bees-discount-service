import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { BaseUserDTO } from './base-user.dto';

export class CreateUserDTO extends BaseUserDTO {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
