import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({})],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
