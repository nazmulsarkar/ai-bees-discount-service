import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export interface MailConfig {
  from?: string;
  to: string;
  subject: string;
  templateName: string;
}

export class MailConfig implements MailConfig {
  @IsOptional()
  @IsEmail()
  from?: string;

  @IsNotEmpty()
  @IsEmail()
  to: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  templateName: string;
}
