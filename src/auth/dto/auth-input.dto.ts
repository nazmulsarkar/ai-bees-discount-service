import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { GrantTypeEnum } from '../../common/enums/grant-type.enum';

export class AuthInputDTO {
  @IsEnum(GrantTypeEnum)
  grantType: GrantTypeEnum;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password?: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;
}
