import type {
  ArgumentsHost,
  ExceptionFilter as BaseExceptionFilter,
} from '@nestjs/common';
import {
  Catch,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { Response } from 'express';
import { EntityNotFoundError } from 'typeorm';

import { camelCase, isString, upperCase } from 'lodash';
import { ErrorResponse, GObj } from '../responses/response.type';
import { BaseHttpException } from './base-http.exception';

interface ExceptionResponse {
  message: unknown;
  error: string;
}

@Catch()
export class ExceptionFilter implements BaseExceptionFilter {
  constructor() {}

  private dontReport = [
    NotFoundException.name,
    UnprocessableEntityException.name,
  ];

  private exception: Error;

  private exceptionResponse: ExceptionResponse | undefined;

  catch(exception: unknown, host: ArgumentsHost) {
    this.parseException(exception);

    const status = this.getStatus();

    // get request and response object
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // format response
    const formattedResponse: ErrorResponse = {
      status,
      exception: this.getException(),
      message: this.getMessage(),
      errors: this.getErrors(),
    };

    // send response
    response.status(status).json(formattedResponse);

    // log
    this.report();
  }

  private report() {
    if (this.dontReport.includes(this.exception.name)) {
      return;
    }
  }

  getStatus(): number {
    if (this.exception instanceof HttpException) {
      return this.exception.getStatus();
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  getException(): string {
    return upperCase(camelCase(this.exception.name)).replaceAll(' ', '_');
  }

  getErrors(): GObj[] | null {
    if (this.exception instanceof UnprocessableEntityException) {
      return this.exceptionResponse?.message as GObj[];
    }

    return null;
  }

  getMessage(): string {
    console.log('message: ', this.exception);
    if (
      this.exception instanceof BaseHttpException &&
      isString(this.exceptionResponse?.message)
    ) {
      return this.exceptionResponse!.message as string;
    } else if (this.exception.message) {
      return this.exception.message;
    }

    return 'Something went wrong';
  }

  parseException(exception): void {
    // Set exception obj
    this.exception = exception;

    if (this.exception instanceof EntityNotFoundError) {
      this.exception = new NotFoundException();
    }

    // extract HttpException details
    if (this.exception instanceof HttpException) {
      this.exceptionResponse =
        this.exception.getResponse() as ExceptionResponse;
    }

    if (this.exceptionResponse && this.exception instanceof BaseHttpException) {
      this.exceptionResponse.message = this.exception.getMessage();
    }
  }
}
