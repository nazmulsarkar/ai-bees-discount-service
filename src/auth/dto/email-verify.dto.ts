import { IsString, Matches, MinLength } from 'class-validator';
import { Match } from '../../common/decorators/match.decorator';

export class EmailVerifyDTO {
  @IsString()
  code: string;

  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password?: string;

  @IsString()
  @MinLength(8)
  @Match('password')
  passwordConfirm: string;
}
