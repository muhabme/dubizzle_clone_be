import { HttpException, HttpStatus } from '@nestjs/common';
import { camelCase } from 'lodash';

export interface Exception {
  message?: string;
  status?: HttpStatus;
}

/**
 * Defines the base HTTP exception for whole app.
 */
export class BaseHttpException extends HttpException {
  static throw<T>(this: new (error?: Exception) => T, error?: unknown): T {
    return new this(error as Error);
  }

  protected args: Record<string, string> = {};

  /**
   * Instantiate an `BaseHttpException` Exception.
   *
   * @example
   * `throw new BaseHttpException()`
   */
  constructor(error?: Exception) {
    error = error ?? {};

    error.status = error.status || HttpStatus.BAD_REQUEST;
    error.message = error.message ?? '';

    super(
      BaseHttpException.createBody(null, error.message, error.status),
      error.status,
    );
  }

  getMessage(): string {
    let translationKey = camelCase(this.constructor.name);

    if (translationKey === 'baseHttpException') {
      translationKey = 'ok';
    }

    return translationKey;
  }
}
