import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({
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
  }): Promise<JwtPayload> {
    const user = await this.userService.findOne({ _id });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
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
    };
  }
}
