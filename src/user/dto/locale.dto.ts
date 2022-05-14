import { Types } from 'mongoose';
import { IsEnum, IsString } from 'class-validator';
import { LanguageEnum } from '../../common/enums/language.enum';

export class LocaleDto {
  @IsEnum(LanguageEnum)
  language: LanguageEnum;
}

export class Locale extends LocaleDto {
  @IsString()
  userId: Types.ObjectId;
}
