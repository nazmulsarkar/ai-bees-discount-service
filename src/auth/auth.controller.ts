import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseErrorFilter } from '../common/filters/mongoose-error.filter';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SignUpDTO } from './dto/sign-up.dto';
import { AuthInputDTO } from './dto/auth-input.dto';
import {
  ChangePasswordDTO,
  ForgotPasswordDTO,
} from './dto/forgot-password.dto';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { CurrentUser } from '../common/decorators/user.decorator';
import { SignUpResponse } from './dto/sign-up-response.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(200)
  @UseFilters(MongooseErrorFilter)
  async signup(@Body() signupDTO: SignUpDTO): Promise<SignUpResponse> {
    return this.authService.signUp(signupDTO);
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(
    @Body() forgotPasswordDTO: ForgotPasswordDTO,
  ): Promise<SignUpResponse> {
    return this.authService.forgotPassword(forgotPasswordDTO);
  }

  @Post('verify')
  @HttpCode(200)
  async verifyEmailByCode(
    @Body() verifyDTO: UpdatePasswordDTO,
  ): Promise<AuthResponseDto> {
    return this.authService.updatePassword({
      ...verifyDTO,
    });
  }

  @Post('token')
  @HttpCode(200)
  authToken(@Body() authInput: AuthInputDTO): Promise<AuthResponseDto> {
    return this.authService.authToken(authInput);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getUserMe(@CurrentUser() user: JwtPayload): Promise<any> {
    return user;
  }

  @Post('change-password')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() changePasswordDTO: ChangePasswordDTO,
  ): Promise<SignUpResponse> {
    return this.authService.changePassword(user._id, changePasswordDTO);
  }

  // @Post('logout')
  // @HttpCode(200)
  // @UseGuards(JwtAuthGuard)
  // async logout(@CurrentUser() user: JwtPayload) {
  //   return this.authService.logout(user._id);
  // }
}
