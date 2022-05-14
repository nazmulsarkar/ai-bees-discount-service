import { IsString } from 'class-validator';

export interface IErrorMessage {
  code: string;
  message: string;
}

export class ErrorMessage implements IErrorMessage {
  @IsString()
  message: string;

  @IsString()
  code: string;

  constructor(arg?: IErrorMessage) {
    this.code = arg?.code;
    this.message = arg?.message;
  }
}
