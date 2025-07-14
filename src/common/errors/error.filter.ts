import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import AppError from './app-error';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Manejo seguro del tipo
    if (exception instanceof AppError) {
      response.status(exception.statusCode).json({
        statusCode: exception.statusCode,
        name: exception.name,
        message: exception.message,
        details: exception.details,
      });
    } else {
      // Errores genéricos (no controlados)
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      response.status(status).json({
        statusCode: status,
        name: exception.name,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        message: exceptionResponse['message'],
      });
    }
  }
}
