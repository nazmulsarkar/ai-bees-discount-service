import { IsEmail, IsEnum, IsString, Matches, MinLength } from 'class-validator';
import { Match } from '../../common/decorators/match.decorator';
import { VerifyActionEnum } from '../../common/enums/verify-action.enum';

export class VerifyDTO {
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'New password too weak',
  })
  password: string;

  @IsString()
  @MinLength(8)
  @Match('password')
  passwordConfirm: string;

  @IsString()
  code: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsEnum(VerifyActionEnum)
  verifyAction: VerifyActionEnum;
}
