import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { isArray, isObject } from 'class-validator';
import { ErrorMessage } from '../dto/error-message.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @InjectSentry()
    private readonly sentryClient: SentryService,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorRes =
      exception instanceof HttpException ? exception?.getResponse() : exception;

    const messages =
      errorRes?.['message'] || exception?.message || 'Unknown error';

    const errors: ErrorMessage[] = [];

    if (errorRes && isObject(errorRes) && errorRes['code']) {
      // if (isArray(message) && message.length > 0) {
      //   for (let i = 0; i < message.length; i++) {
      //     const error: ErrorMessage = {
      //       code: message[i].replace(' ', '_'),
      //       message: message[i],
      //     };
      //   }
      // }

      const error: ErrorMessage = new ErrorMessage({
        code: errorRes['code'],
        message: errorRes['message'],
      });
      errors.push(error);
    }

    const exceptionInfo = {
      success: false,
      errors,
      statusCode: status,
      message: messages.toString(),
      timestamp: new Date().toISOString(),
      path: request.url,
      body: request?.body || null,
      userId: request?.user?._id || null,
    };

    this.sentryClient.instance().captureException(exception, {
      extra: exceptionInfo,
    });

    response.status(status).json(exceptionInfo);
  }
}
