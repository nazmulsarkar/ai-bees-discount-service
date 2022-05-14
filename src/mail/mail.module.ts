import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

import { ConfigModule } from '@nestjs/config';
import { SendGridModule } from '@anchan828/nest-sendgrid';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    SendGridModule.forRoot({
      apikey: process.env.SENDGRID_API_KEY,
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
