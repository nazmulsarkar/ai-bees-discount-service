import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { userStub } from '../../common/test/stubs/user.stub';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from '../../mail/mail.module';
import { VerificationModule } from '../../verification/verification.module';
import { AuthController } from '../auth.controller';
import { VerificationService } from '../../verification/verification.service';
import { MailService } from '../../mail/mail.service';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { SignUpResponse } from '../dto/sign-up-response.dto';
import { SignUp, SignUpDTO } from '../dto/sign-up.dto';
import {
  changePasswordDTO,
  changePasswordResponseStub,
  signupResponseStub,
  updatePasswordStub,
} from './stubs/auth.stubs';
import {
  ChangePasswordDTO,
  ForgotPasswordDTO,
} from '../dto/forgot-password.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { AuthInputDTO } from '../dto/auth-input.dto';
import { GrantTypeEnum } from '../../common/enums/grant-type.enum';
import { UserService } from '../../user/user.service';
import { UserModule } from '../../user/user.module';
import { SessionModule } from '../../session/session.module';
import { SessionService } from '../../session/session.service';

jest.mock('../../session/session.module');
jest.mock('../../user/user.module');
jest.mock('../../verification/verification.module');
jest.mock('../../session/session.service');
jest.mock('../../user/user.service');
jest.mock('../../verification/verification.service');
jest.mock('../../mail/mail.service');
jest.mock('../../common/strategies/jwt.strategy');
jest.mock('../auth.controller');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let verifyService: VerificationService;

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
      providers: [
        UserService,
        AuthService,
        VerificationService,
        JwtStrategy,
        MailService,
        SessionService,
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
    verifyService = moduleRef.get<VerificationService>(VerificationService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup', () => {
    describe('when signup by email is called', () => {
      let signupResponse: SignUpResponse;
      let emailSignUpDto: SignUpDTO;
      let emailSignUp: SignUp;

      beforeEach(async () => {
        emailSignUpDto = {
          email: userStub().email,
          firstName: userStub().firstName,
          lastName: userStub().lastName,
        };

        emailSignUp = {
          ...emailSignUpDto,
          ...new SignUp(),
        };

        signupResponse = await authService.signUp(emailSignUp);
      });

      test('then it should call usersService', () => {
        expect(userService.create).toBeCalledWith(emailSignUp);
      });

      test('then it should return success response', () => {
        expect(signupResponse).toEqual({ ...signupResponseStub() });
      });
    });
  });

  describe('forgotPassword', () => {
    describe('when forgotPassword is called', () => {
      let response: SignUpResponse;
      let forgotPasswordDto: ForgotPasswordDTO;
      let queryExistingUser: any;

      beforeEach(async () => {
        forgotPasswordDto = {
          email: userStub().email,
        };
        queryExistingUser = {
          email: userStub().email,
          isEmailVerified: true,
          isActive: true,
        };

        response = await authService.forgotPassword(forgotPasswordDto);
      });

      test('then it should call usersService', () => {
        expect(userService.findOne).toBeCalledWith(queryExistingUser);
      });

      test('then it should return success response', () => {
        expect(response).toEqual(signupResponseStub());
      });
    });
  });

  describe('changePassword', () => {
    describe('when changePassword is called', () => {
      let response: SignUpResponse;
      let changePasswordDto: ChangePasswordDTO;

      beforeEach(async () => {
        changePasswordDto = {
          ...changePasswordDTO(),
        };

        response = await authService.changePassword(
          userStub()._id,
          changePasswordDto,
        );
      });

      test('then it should call usersService.updateOne', () => {
        expect(userService.updateOne).toBeCalled();
      });

      // test('then it should call authService.getHash', () => {
      //   expect(authService.getHash).toBeCalled();
      // });

      test('then it should return success response', () => {
        expect(response).toEqual(changePasswordResponseStub());
      });
    });
  });

  describe('verifyAccount', () => {
    describe('when verifyAccount is called', () => {
      let response: AuthResponseDto;

      beforeEach(async () => {
        response = await authService.verifyAccount({
          ...updatePasswordStub(),
        });
      });

      test('then it should call verifyService.findOne', () => {
        expect(verifyService.findOne).toBeCalled();
      });

      test('then it should call usersService.updateOne', () => {
        expect(userService.updateOne).toBeCalled();
      });

      test('then it should call verifyService.removeById', () => {
        expect(verifyService.removeById).toBeCalled();
      });

      test("then it should return 'token' with success response", () => {
        expect(response).toHaveProperty('token');
      });

      test("then it should return 'tokenType' with success response", () => {
        expect(response).toHaveProperty('tokenType');
      });
    });
  });

  describe('authToken', () => {
    describe('when authToken is called', () => {
      let response: AuthResponseDto;
      let authInput: AuthInputDTO;

      beforeEach(async () => {
        authInput = {
          grantType: GrantTypeEnum.ACCESS_TOKEN,
          email: userStub().email,
          password: `${process.env.DEFAULT_PASS}`,
        };
        response = await authService.authToken({
          ...authInput,
        });
      });

      test('then it should check authService.authEmailPass exists', () => {
        expect(authService.authEmailPass).toBeDefined();
      });

      test("then it should return 'token' with success response", () => {
        expect(response).toHaveProperty('token');
      });

      test("then it should return 'tokenType' with success response", () => {
        expect(response).toHaveProperty('tokenType');
      });
    });
  });
});
