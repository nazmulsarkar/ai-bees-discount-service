import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import { Match } from '../../common/decorators/match.decorator';
import { NotMatch } from '../../common/decorators/not-match.decorator';

export class ForgotPasswordDTO {
  @IsEmail()
  email: string;
}

export class ChangePasswordDTO {
  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'New password too weak',
  })
  @NotMatch('password')
  newPassword?: string;

  @IsString()
  @MinLength(8)
  @Match('newPassword')
  newPasswordConfirm: string;
}

export class ResetPasswordDTO {
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'New password too weak',
  })
  newPassword: string;

  @IsString()
  @MinLength(8)
  @Match('newPassword')
  newPasswordConfirm: string;

  @IsString()
  code: string;
}
