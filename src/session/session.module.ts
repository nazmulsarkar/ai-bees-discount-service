import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from '../entities/session.entity';
import { SessionService } from './session.service';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    MongooseModule.forFeature([
      {
        name: Session.name,
        schema: SessionSchema,
      },
    ]),
    JwtModule.register({
      secret: `${process.env.SESSION_SECRET}`,
      signOptions: { expiresIn: `${process.env.SESSION_EXPIRES}` },
    }),
  ],
  exports: [SessionService],
  providers: [SessionService],
})
export class SessionModule {}
