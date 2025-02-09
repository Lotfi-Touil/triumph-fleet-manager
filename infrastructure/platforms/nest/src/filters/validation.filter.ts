import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch(BadRequestException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const validationErrors = exception.getResponse() as any;
    let errorMessages: string[] = [];

    if (validationErrors.message && Array.isArray(validationErrors.message)) {
      errorMessages = validationErrors.message;
    } else if (typeof validationErrors.message === 'string') {
      errorMessages = [validationErrors.message];
    }

    response.status(status).json({
      statusCode: status,
      message: errorMessages.join(', '),
      error: 'Validation Error',
    });
  }
}
