import { IsString } from 'class-validator';

export class VerifyPersonalNumberDto {
  @IsString()
  readonly orderRef: string;
  @IsString()
  readonly personalNumber: string;
}
