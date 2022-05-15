import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { GrantTypeEnum } from '../../common/enums/grant-type.enum';
import { VerifyActionEnum } from '../../common/enums/verify-action.enum';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { userStub } from '../../common/test/stubs/user.stub';
import { MailModule } from '../../mail/mail.module';
import { UserModule } from '../../user/user.module';
import { VerificationModule } from '../../verification/verification.module';
import { AuthController } from '../auth.controller';
import { AuthService } from '../services/auth.service';
import { AuthInputDTO } from '../dto/auth-input.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import {
  ChangePasswordDTO,
  ForgotPasswordDTO,
} from '../dto/forgot-password.dto';
import { SignUpResponse } from '../dto/sign-up-response.dto';
import { SignUpDTO } from '../dto/sign-up.dto';
import { VerifyDTO } from '../dto/verify.dto';
import { SessionModule } from '../../session/session.module';

jest.mock('../../common/strategies/jwt.strategy');
jest.mock('../../user/user.module');
jest.mock('../../verification/verification.module');
jest.mock('../services/auth.service');

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    jest.resetModules();

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({}),
        PassportModule,
        JwtModule.register({
          secret: `${process.env.JWT_SECRET}`,
          signOptions: { expiresIn: `${process.env.JWT_EXPIRES}` },
        }),
        UserModule,
        MailModule,
        VerificationModule,
        SessionModule,
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    describe('when signup by email is called', () => {
      let signupResponse: SignUpResponse;
      let signupFromServiceResponse: SignUpResponse;
      let emailSignUpDto: SignUpDTO;

      beforeEach(async () => {
        emailSignUpDto = {
          email: userStub().email,
          firstName: userStub().firstName,
          lastName: userStub().lastName,
        };

        signupResponse = await authController.signup(emailSignUpDto);
        signupFromServiceResponse = await authService.signUp(emailSignUpDto);
      });

      test('then it should call service', () => {
        expect(authService.signUp).toBeCalledWith(emailSignUpDto);
      });

      test('then it should return success response', () => {
        expect(signupResponse).toEqual(signupFromServiceResponse);
      });
    });
  });

  describe('forgotPassword', () => {
    describe('when forgotPassword is called', () => {
      let forgotPasswordResponse: SignUpResponse;
      let forgotPasswordFromServiceResponse: SignUpResponse;
      let forgotPasswordDto: ForgotPasswordDTO;

      beforeEach(async () => {
        forgotPasswordDto = {
          email: userStub().email,
        };

        forgotPasswordResponse = await authController.forgotPassword(
          forgotPasswordDto,
        );
        forgotPasswordFromServiceResponse = await authService.forgotPassword(
          forgotPasswordDto,
        );
      });

      test('then it should call authService.forgotPassword', () => {
        expect(authService.forgotPassword).toBeCalledWith(forgotPasswordDto);
      });

      test('then it should return success response', () => {
        expect(forgotPasswordResponse).toEqual(
          forgotPasswordFromServiceResponse,
        );
      });
    });
  });

  describe('verifyAccount', () => {
    describe('when verifyAccount is called', () => {
      let verifyResponse: AuthResponseDto;
      let verifyFromServiceResponse: AuthResponseDto;

      const updatePasswordDto: VerifyDTO = {
        email: ``,
        code: `4503`,
        password: `1qazZAQ!`,
        passwordConfirm: `1qazZAQ!`,
        verifyAction: VerifyActionEnum.EMAIL_VERIFICATION,
      };

      beforeEach(async () => {
        verifyResponse = await authController.verifyEmailByCode(
          updatePasswordDto,
        );
        verifyFromServiceResponse = await authService.verifyAccount(
          updatePasswordDto,
        );
      });

      test('then it should call authService.updatePassword', () => {
        expect(authService.verifyAccount).toBeCalledWith(updatePasswordDto);
      });

      test('then it should return success response', () => {
        expect(verifyResponse).toEqual(verifyFromServiceResponse);
      });
    });
  });

  describe('authToken', () => {
    describe('when authToken is called', () => {
      let tokenResponse: AuthResponseDto;
      let tokenFromServiceResponse: AuthResponseDto;

      const authInput: AuthInputDTO = {
        grantType: GrantTypeEnum.ACCESS_TOKEN,
        email: userStub().email,
        password: `1qazZAQ!`,
      };

      beforeEach(async () => {
        tokenResponse = await authController.authToken(authInput);
        tokenFromServiceResponse = await authService.authToken(authInput);
      });

      test('then it should call authService.authToken', () => {
        expect(authService.authToken).toBeCalledWith(authInput);
      });

      test('then it should return success response', () => {
        expect(tokenResponse).toEqual(tokenFromServiceResponse);
      });
    });
  });

  describe('getUserMe', () => {
    describe('when getUserMe is called', () => {
      let meResponse: JwtPayload;

      const me: JwtPayload = {
        ...userStub(),
      };

      beforeEach(async () => {
        meResponse = await authController.getUserMe(me);
      });

      test('then it should return current logged-in user detail', () => {
        expect(meResponse).toEqual(me);
      });
    });
  });

  describe('changePassword', () => {
    describe('when changePassword is called', () => {
      let chnagePasswordResponse: SignUpResponse;
      let chnagePasswordFromServiceResponse: SignUpResponse;

      const changePasswordDTO: ChangePasswordDTO = {
        password: `1qazZAQ!`,
        newPassword: `1qazZAQ!@`,
        newPasswordConfirm: `1qazZAQ!@`,
      };

      beforeEach(async () => {
        chnagePasswordResponse = await authController.changePassword(
          userStub(),
          changePasswordDTO,
        );
        chnagePasswordFromServiceResponse = await authService.changePassword(
          userStub()._id,
          changePasswordDTO,
        );
      });

      test('then it should call authService.changePassword', () => {
        expect(authService.changePassword).toBeCalledWith(
          userStub()._id,
          changePasswordDTO,
        );
      });

      test('then it should return success response', () => {
        expect(chnagePasswordResponse).toEqual(
          chnagePasswordFromServiceResponse,
        );
      });
    });
  });
});
