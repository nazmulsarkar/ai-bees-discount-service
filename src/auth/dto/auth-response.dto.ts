import { IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ErrorMessage } from './../../common/dto/error-message.dto';
import { TokenTypeEnum } from '../../common/enums/token-type.enum';

export class AuthResponseDto {
  @IsBoolean()
  success = true;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  errors?: ErrorMessage[] = [];

  @IsString()
  token: string;

  @IsEnum(TokenTypeEnum)
  tokenType: TokenTypeEnum = TokenTypeEnum.BEARER;

  // @IsOptional()
  // @IsString()
  // expires? = `${process.env.JWT_EXPIRES}`;

  @IsOptional()
  @IsString()
  refreshToken?: string;
}
