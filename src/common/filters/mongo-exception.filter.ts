import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    if (exception.code === 11000) {
      response.status(400).json({
        success: false,
        message: exception.errmsg || 'Duplicate value exists',
      });
    } else {
      response.status(500).json({ success: false, message: 'Internal error.' });
    }
  }
}
