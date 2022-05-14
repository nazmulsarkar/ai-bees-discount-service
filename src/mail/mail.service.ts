// import { SendGridService } from '@anchan828/nest-sendgrid';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailConfig } from './mail-config.dto';
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

  async sendEmail({ config, ctx }: { config: MailConfig; ctx: any }) {
    return this.mailerService.sendMail({
      to: config.to,
      from: config.from || '"No Reply" <noreply@allezpadel.dev>',
      subject:
        config.subject ||
        `Welcome to AllezPadel! Verify your email using the code!`,
      template: config.templateName, // 'verification',
      context: ctx,
    });
  }
}
