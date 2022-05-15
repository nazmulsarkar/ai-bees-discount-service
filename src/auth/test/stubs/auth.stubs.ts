import { AuthResponseDto } from '../../dto/auth-response.dto';
import { TokenTypeEnum } from '../../../common/enums/token-type.enum';
import { userStub } from '../../../common/test/stubs/user.stub';
import { ChangePasswordDTO } from '../../dto/forgot-password.dto';
import { VerifyDTO } from '../../dto/verify.dto';
import { VerifyActionEnum } from '../../../common/enums/verify-action.enum';
import { SignUpResponse } from '../../dto/sign-up-response.dto';

export const authSuccResponseStub = (): AuthResponseDto => ({
  success: true,
  tokenType: TokenTypeEnum.BEARER,
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
});

export const changePasswordDTO = (): ChangePasswordDTO => {
  return {
    password: `1qazZAQ!`,
    newPassword: `1qazZAQ!@`,
    newPasswordConfirm: `1qazZAQ!@`,
  };
};

export const updatePasswordStub = (): VerifyDTO => {
  return {
    password: `1qazZAQ!`,
    passwordConfirm: `1qazZAQ!`,
    code: `4038`,
    email: `testme@yopmail.com`,
    verifyAction: VerifyActionEnum.EMAIL_VERIFICATION,
  };
};

export const signupResponseStub = () => {
  return {
    success: true,
    message: `Verification code sent to this email: ${
      userStub().email
    }, Please check your email inbox!`,
  };
};

export const changePasswordResponseStub = () => {
  return {
    ...new SignUpResponse(),
    success: true,
    message: `New password is set.`,
  };
};
