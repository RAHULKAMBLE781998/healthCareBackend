import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
  ExceptionFilter
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    else if (exception instanceof NotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
    }

    else if (exception instanceof ForbiddenException) {
      status = HttpStatus.FORBIDDEN;
      message = exception.message;
    }

    else if (exception instanceof UnauthorizedException) {
      status = HttpStatus.UNAUTHORIZED;
      message = exception.message;
    }

    else if (exception instanceof BadRequestException) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    }

    else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      message = (exception as QueryFailedError).message;
    }

    response.status(status).json({
      statusCode: status,
      message: message
    });
  }

}
