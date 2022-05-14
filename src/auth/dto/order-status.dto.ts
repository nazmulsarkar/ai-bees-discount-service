import { IsString } from 'class-validator';

export class OrderStatusDto {
  @IsString()
  readonly personalNumber: string;
}
