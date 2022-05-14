// import { SendGridService } from '@anchan828/nest-sendgrid';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { VERIFY_EMAIL_TEMPLATE } from '../common/constants/sendgrid-templates';
// import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
// import { MailConfig } from './mail-config.dto';

@Injectable()
export class MailService {
  constructor(
    // private readonly sendGrid: SendGridService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendUserConfirmation(ctxData) {
    return this.mailerService.sendMail({
      to: ctxData.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Discount Service! Please confirm your email.',
      template: './confirmation',
      context: {
        ...ctxData,
      },
    });
  }
}
