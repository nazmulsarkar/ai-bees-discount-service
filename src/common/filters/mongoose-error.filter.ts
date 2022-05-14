import { HttpStatus } from '@nestjs/common';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Error } from 'mongoose';
import ValidationError = Error.ValidationError;

@Catch(ValidationError)
export class MongooseErrorFilter implements ExceptionFilter {
  // private logger = new Logger(MongooseErrorFilter.name);

  catch(exception: ValidationError, host: ArgumentsHost): any {
    const keys = Object.keys(exception.errors);
    console.log('k: ', exception);

    const errors = {};

    keys.forEach((key) => {
      errors[key] = [exception.errors[key].message];
    });

    const ctx = host.switchToHttp(),
      response = ctx.getResponse();

    return response.status(HttpStatus.FORBIDDEN).json({
      success: false,
      statusCode: HttpStatus.FORBIDDEN,
      message: errors,
    });
  }
}
