import { ErrorMessage } from './../../common/dto/error-message.dto';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class SignUpResponse {
  @IsBoolean()
  success: boolean;

  @IsString()
  message: string;

  @IsOptional()
  @IsArray()
  errors?: ErrorMessage[] = [];
}
