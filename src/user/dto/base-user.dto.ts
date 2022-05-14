import { IsString, IsEmail, IsArray, IsEnum } from 'class-validator';
import { LanguageEnum } from '../../common/enums/language.enum';
import { Role } from '../../common/enums/role.enum';

export class BaseUserDTO {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsArray()
  roles: Role[];

  @IsEnum(LanguageEnum)
  language: LanguageEnum;
}
