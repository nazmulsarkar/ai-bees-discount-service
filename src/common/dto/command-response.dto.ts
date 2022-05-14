import { IsArray, IsBoolean, IsOptional } from 'class-validator';
import { ErrorMessage } from './error-message.dto';

export interface ICommandResponse {
  success: boolean;
  message?: string;
  errors?: ErrorMessage[];
}

export class CommandResponse implements ICommandResponse {
  @IsBoolean()
  success = true;

  @IsOptional()
  @IsArray()
  message?: string;

  @IsOptional()
  @IsArray()
  errors?: ErrorMessage[] = [];

  constructor(arg?: ICommandResponse) {
    this.success = arg?.success;
    this.message = arg?.message;
    this.errors = arg?.errors;
  }
}
