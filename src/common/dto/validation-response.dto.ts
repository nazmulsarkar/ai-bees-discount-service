import { IsArray, IsBoolean, IsString } from 'class-validator';

export interface IValidationResponse {
  isValid: boolean;
  message: string[];
  code?: string;
}

export class ValidationResponse implements IValidationResponse {
  @IsBoolean()
  isValid = true;

  @IsArray()
  message: string[] = [];

  @IsString()
  code?: string;

  constructor(arg?: IValidationResponse) {
    this.isValid = arg?.isValid;
    this.message = arg?.message;
    this.code = arg?.code;
  }
}
