import { ErrorMessage } from './../common/dto/error-message.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { AuthResponseDto } from './dto/auth-response.dto';
import { SignUp, SignUpDTO } from './dto/sign-up.dto';
import { SignUpResponse } from './dto/sign-up-response.dto';
import { AuthInputDTO } from './dto/auth-input.dto';
import { User } from '../entities/user.entity';
import { MailService } from '../mail/mail.service';
import { GrantTypeEnum } from '../common/enums/grant-type.enum';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import {
  ChangePasswordDTO,
  ForgotPasswordDTO,
} from './dto/forgot-password.dto';
import { ValidationResponse } from '../common/dto/validation-response.dto';
import { VerificationService } from '../verification/verification.service';
import { CreateVerificationDTO } from '../verification/dto/create-verification.dto';
import { VerifyActionEnum } from '../common/enums/verify-action.enum';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { SessionService } from '../session/session.service';
import { MongoFilter } from '../common/filters/mongo-exception.filter';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
  defaultTokenResponse: AuthResponseDto = new AuthResponseDto();

  constructor(
    private readonly userService: UserService,
    private readonly verifyService: VerificationService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly sessionService: SessionService,
  ) {}

  @UseFilters(MongoFilter)
  async signUp(signupDTO: SignUpDTO): Promise<SignUpResponse> {
    const signupResponse = new SignUpResponse();
    const createUserDTO: SignUp = {
      ...signupDTO,
      ...new SignUp(),
    };
    try {
      // first create the user
      const createdUser = await this.userService.create(createUserDTO);

      // if user not created, return error
      if (!createdUser) {
        throw new BadRequestException(
          new ErrorMessage({
            code: 'user_not_created',
            message: `User couldn't be created!`,
          }),
        );
      }

      const createdVerification = await this.createVerification(
        createdUser,
        VerifyActionEnum.EMAIL_VERIFICATION,
      );

      if (!createdVerification) {
        throw new BadRequestException(
          new ErrorMessage({
            code: 'verification_not_created',
            message: `Verification process not generated!`,
          }),
        );
      }

      const sentEmail = await this.sendVerificationCode({
        email: createdUser.email,
        displayName: createdUser.displayName,
        code: createdVerification.code,
        templateName: `confirmation`,
      });

      if (!sentEmail) {
        throw new InternalServerErrorException(
          new ErrorMessage({
            code: 'email_not_sent',
            message: `There is an error with email sending process!`,
          }),
        );
      }

      signupResponse.success = true;
      signupResponse.message = `Verification code sent to this email: ${createdUser.email}, Please check your email inbox!`;

      return signupResponse;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  private async createVerification(
    createdUser: User,
    action: VerifyActionEnum,
  ) {
    const verifyDTO: CreateVerificationDTO = {
      user: createdUser._id,
      data: {
        action,
      },
    };

    try {
      return this.verifyService.create({
        ...verifyDTO,
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  private async sendVerificationCode({
    email,
    displayName,
    code,
    templateName,
  }: {
    email: string;
    displayName: string;
    code: string;
    templateName: string;
  }) {
    const mailConfig = {
      to: email,
      subject: `Verify your account email`,
      templateName,
    };

    const ctxData = { email, code, displayName };

    try {
      return this.mailService.sendUserConfirmation({
        config: mailConfig,
        ctx: ctxData,
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async forgotPassword(
    forgotPasswordDTO: ForgotPasswordDTO,
  ): Promise<SignUpResponse> {
    const forgotPasswordResponse = new SignUpResponse();

    const queryUser: any = {
      email: forgotPasswordDTO.email,
      isEmailVerified: true,
      isActive: true,
    };

    const forgottenUser = await this.userService.findOne({ ...queryUser });

    if (!forgottenUser) {
      throw new NotFoundException(
        new ErrorMessage({
          code: `user_not_found`,
          message: `User couldn't be found!`,
        }),
      );
    }

    const createdVerification = await this.createVerification(
      forgottenUser,
      VerifyActionEnum.FORGOT_PASSWORD,
    );

    if (!createdVerification) {
      throw new BadRequestException(
        new ErrorMessage({
          code: 'verification_not_created',
          message: `Verification process not generated!`,
        }),
      );
    }

    try {
      await this.sendVerificationCode({
        email: forgottenUser.email,
        displayName: forgottenUser.displayName,
        code: createdVerification.code,
        templateName: `confirmation`,
      });

      forgotPasswordResponse.success = true;
      forgotPasswordResponse.message = `Verification code sent to this email: ${forgottenUser.email}, Please check your email inbox!`;

      return forgotPasswordResponse;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async changePassword(
    userId: Types.ObjectId,
    changePasswordDTO: ChangePasswordDTO,
  ): Promise<SignUpResponse> {
    const response = new SignUpResponse();

    const userQuery: any = {
      _id: userId,
    };

    try {
      const validation = await this.validateChangePassword(
        userId,
        changePasswordDTO,
      );

      if (!validation.isValid) {
        throw new BadRequestException(validation.message.toString());
      }

      const updatedUser = await this.userService.updateOne(
        { ...userQuery },
        {
          password: await this.getHash(changePasswordDTO.newPassword),
        },
      );

      if (!updatedUser) {
        response.success = false;
        response.message = `New password couldn't be set now. Please try later!`;
        response.errors.push(
          new ErrorMessage({
            code: `password_not_set`,
            message: `New password couldn't be set now. Please try later!`,
          }),
        );
        return response;
      }

      response.success = true;
      response.message = `New password is set.`;
      return response;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  private async validateChangePassword(
    userId: Types.ObjectId,
    changePasswordDTO: ChangePasswordDTO,
  ): Promise<ValidationResponse> {
    const validation = new ValidationResponse();
    validation.isValid = true;
    validation.message = [];

    const query: any = {
      _id: userId,
    };

    const user = await this.userService.findOne({ ...query });

    const isCorrectPass = await this.compareHash({
      password: changePasswordDTO.password,
      hashedPassword: user.password,
    });

    if (!isCorrectPass) {
      validation.isValid = false;
      validation.message.push(
        `Provided password is incorrect. Please provide correct one!`,
      );
      return validation;
    }

    return validation;
  }

  async updatePassword(
    updatePassword: UpdatePasswordDTO,
  ): Promise<AuthResponseDto> {
    const tokenResponse: AuthResponseDto = new AuthResponseDto();

    const verifyQuery: any = {
      code: updatePassword.code,
    };

    const verifiedData = await this.verifyService.findOne({ ...verifyQuery });

    if (
      !verifiedData ||
      (verifiedData.user as User).email !== updatePassword.email
    ) {
      throw new BadRequestException(
        new ErrorMessage({
          message: `Couldn't verify the provided code!`,
          code: 'code_not_verified',
        }),
      );
    }

    const now = new Date().getTime();
    const expiry = verifiedData.expiry.getTime();

    if (!(expiry > now)) {
      throw new BadRequestException(`Provided code is expired!`);
    }

    const userQuery: Partial<User> = {
      _id: (verifiedData.user as User)._id,
      isActive:
        updatePassword.verifyAction === VerifyActionEnum.EMAIL_VERIFICATION
          ? false
          : true,
      isEmailVerified:
        updatePassword.verifyAction === VerifyActionEnum.EMAIL_VERIFICATION
          ? false
          : true,
    };

    try {
      const updateUserModel: Partial<User> = {
        password: await this.getHash(updatePassword.password),
      };

      if (updatePassword.verifyAction === VerifyActionEnum.EMAIL_VERIFICATION) {
        updateUserModel.isActive = true;
        updateUserModel.isEmailVerified = true;
      }

      const updatedUser = await this.userService.updateOne(
        { ...userQuery },
        {
          ...updateUserModel,
        },
      );

      if (!updatedUser) {
        tokenResponse.success = false;
        tokenResponse.errors.push(
          new ErrorMessage({
            message: `Couldn't update the user!`,
            code: 'user_not_updated',
          }),
        );
        return tokenResponse;
      }

      this.verifyService.removeById(verifiedData._id);

      const {
        _id,
        email,
        firstName,
        lastName,
        displayName,
        roles,
        lastLoginTime,
        loginCount,
        isEmailVerified,
        isActive,
        createdAt,
        updatedAt,
      } = updatedUser;

      const token = await this.generateAccessToken({
        _id,
        email,
        firstName,
        lastName,
        displayName,
        roles,
        lastLoginTime,
        loginCount,
        isEmailVerified,
        isActive,
        createdAt,
        updatedAt,
      });

      if (!token) {
        tokenResponse.success = false;
        tokenResponse.errors.push(
          new ErrorMessage({
            message: `Couldn't create the token!`,
            code: 'token_not_created',
          }),
        );
        return tokenResponse;
      }

      tokenResponse.token = token;

      const session = await this.sessionService.generateRefreshToken(_id);

      if (!session) {
        tokenResponse.success = false;
        tokenResponse.errors.push(
          new ErrorMessage({
            message: `Couldn't create the session!`,
            code: 'session_not_created',
          }),
        );
        return tokenResponse;
      }

      tokenResponse.refreshToken = session.refreshToken;

      return tokenResponse;
    } catch (err) {
      throw new BadRequestException(`Couldn't verify the provided code!`);
    }
  }

  async authToken(authInput: AuthInputDTO): Promise<AuthResponseDto> {
    try {
      let tokenResponse: AuthResponseDto;
      const { grantType } = authInput;
      if (!grantType) {
        throw new BadRequestException('grantType is required!');
      }

      switch (grantType) {
        case GrantTypeEnum.ACCESS_TOKEN:
          tokenResponse = await this.authEmailPass(authInput);
          break;
        // To do to replace with refresh token method
        case GrantTypeEnum.REFRESH_TOKEN:
          tokenResponse = await this.authRefreshToken(authInput); // this line will be changed
          break;
        default:
          tokenResponse = await this.authEmailPass(authInput);
          break;
      }
      return tokenResponse;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async authEmailPass(creds: AuthInputDTO): Promise<AuthResponseDto> {
    const tokenResponse: AuthResponseDto = new AuthResponseDto();

    if (!(creds.email && creds.password)) {
      throw new BadRequestException(`Email and Password both are required!`);
    }

    let rolesFilter = {} as any;
    rolesFilter = { $in: [Role.User] };

    const user = await this.userService.findOne({
      roles: rolesFilter,
      email: creds.email,
      isActive: true,
      isEmailVerified: true,
    });

    if (!user) {
      throw new NotFoundException(
        new ErrorMessage({
          code: `user_not_found`,
          message: `User not found!`,
        }),
      );
    }

    try {
      const isCorrectPass = await this.compareHash({
        password: creds.password,
        hashedPassword: user.password,
      });

      if (!isCorrectPass) {
        throw new NotFoundException(
          new ErrorMessage({
            code: `email_pass_wrong`,
            message: `Email or password are wrong!`,
          }),
        );
      }

      const {
        _id,
        email,
        firstName,
        lastName,
        displayName,
        roles,
        lastLoginTime,
        loginCount,
        isEmailVerified,
        isActive,
        createdAt,
        updatedAt,
      } = user;

      const token = await this.generateAccessToken({
        _id,
        email,
        firstName,
        lastName,
        displayName,
        roles,
        lastLoginTime,
        loginCount,
        isEmailVerified,
        isActive,
        createdAt,
        updatedAt,
      });
      tokenResponse.token = token;

      if (!token) {
        tokenResponse.success = false;
        tokenResponse.message = `Token couldn't be created!`;
        tokenResponse.errors.push(
          new ErrorMessage({
            code: `token_not_created`,
            message: `Token couldn't be created!`,
          }),
        );
        return tokenResponse;
      }

      const session = await this.sessionService.generateRefreshToken(_id);
      if (!session) {
        tokenResponse.success = false;
        tokenResponse.errors.push(
          new ErrorMessage({
            message: `Couldn't create the session!`,
            code: 'session_not_created',
          }),
        );
        return tokenResponse;
      }
      tokenResponse.refreshToken = session.refreshToken;

      return tokenResponse;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async authRefreshToken(creds: AuthInputDTO): Promise<AuthResponseDto> {
    const tokenResponse: AuthResponseDto = new AuthResponseDto();
    const { refreshToken } = creds;

    if (!refreshToken) {
      throw new UnauthorizedException('Access denied, refresh token missing!');
    }

    try {
      const sessionDoc =
        await this.sessionService.verifyAndGenerateRefreshToken(refreshToken);
      if (!sessionDoc) {
        tokenResponse.success = false;
        tokenResponse.errors.push(
          new ErrorMessage({
            message: `Refresh token couldn't be verified!`,
            code: 'refresh_token_not_verified',
          }),
        );
        return tokenResponse;
        // throw new UnauthorizedException(`Refresh token couldn't be verified`);
      }

      const user = await this.userService.findOne({
        _id: sessionDoc.userId,
      });

      if (!user) {
        tokenResponse.success = false;
        tokenResponse.message = `User couldn't be found!`;
        tokenResponse.errors.push(
          new ErrorMessage({
            code: `user_not_found`,
            message: `User couldn't be found!`,
          }),
        );
        return tokenResponse;
      }

      const {
        _id,
        email,
        firstName,
        lastName,
        displayName,
        roles,
        lastLoginTime,
        loginCount,
        isEmailVerified,
        isActive,
        createdAt,
        updatedAt,
      } = user;

      const accessToken = await this.generateAccessToken({
        _id,
        email,
        firstName,
        lastName,
        displayName,
        roles,
        lastLoginTime,
        loginCount,
        isEmailVerified,
        isActive,
        createdAt,
        updatedAt,
      });

      if (!accessToken) {
        tokenResponse.success = false;
        tokenResponse.message = `Token couldn't be created!`;
        tokenResponse.errors.push(
          new ErrorMessage({
            code: `token_not_created`,
            message: `Token couldn't be created!`,
          }),
        );
        return tokenResponse;
      }

      tokenResponse.token = accessToken;
      tokenResponse.refreshToken = sessionDoc.refreshToken;
      return tokenResponse;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  async generateAccessToken(user: JwtPayload): Promise<string> {
    const {
      _id,
      email,
      firstName,
      lastName,
      displayName,
      roles,
      lastLoginTime,
      loginCount,
      isEmailVerified,
      isActive,
      createdAt,
      updatedAt,
    } = user;

    try {
      return await this.jwtService.signAsync({
        _id,
        email,
        firstName,
        lastName,
        displayName,
        roles,
        lastLoginTime,
        loginCount,
        isEmailVerified,
        isActive,
        createdAt,
        updatedAt,
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err.message);
    }
  }

  private async compareHash({
    password,
    hashedPassword,
  }: {
    password: string; // password or previous refresh token from client
    hashedPassword: string;
  }): Promise<boolean> {
    try {
      const verified = await argon2.verify(hashedPassword, password);
      if (verified) {
        // this.logger.log('verification of user sucessful');
        return true;
      } else {
        // this.logger.log('verification failed');
        return false;
      }
    } catch (err) {
      // this.logger.log('argon2 error');
      return false;
    }
  }

  async getHash(password: string | undefined): Promise<string> {
    return argon2.hash(password);
  }

  // async logout(userId: Types.ObjectId) {
  //   return this.fcmService.deleteUserFCM(userId);
  // }
}
