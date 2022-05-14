import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Verification,
  VerificationSchema,
} from '../entities/verification.entity';
import { VerificationService } from './verification.service';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    MongooseModule.forFeature([
      {
        name: Verification.name,
        schema: VerificationSchema,
      },
    ]),
  ],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
