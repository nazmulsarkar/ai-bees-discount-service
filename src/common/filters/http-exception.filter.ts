import { error } from 'console';
import { ErrorMessage } from './../dto/error-message.dto';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errors: ErrorMessage[] = await this.getErrorHandled();

    const exceptionInfo = {
      success: false,
      errors: errors,
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(exceptionInfo);
  }

  async getErrorHandled(): Promise<ErrorMessage[]> {
    const error = new ErrorMessage({ code: '', message: '' });
    const errors: ErrorMessage[] = [];
    errors.push(error);
    return errors;
  }
}
