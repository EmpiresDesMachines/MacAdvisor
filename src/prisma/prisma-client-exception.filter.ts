import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response, Request } from 'express';
import { prismaErrorsList } from './prisma-errors-list';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaClientExceptionFilter.name);
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const error = prismaErrorsList[exception.code] || {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Prisma Error',
    };

    const { status, message } = error;

    this.logger.error(
      `PrismaExceptionFilter: [method: ${request.method}, url: ${request.url}]`,
      {
        code: exception.code,
        message: exception.message,
        meta: exception.meta,
      },
    );

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
