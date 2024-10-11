import { HttpStatus } from '@nestjs/common';
import { BaseModel } from '../entities/base.entity';
import { BaseResponse } from './base.response';
import {
  GObj,
  ItemResponse,
  ListResponse,
  ResponseSchema,
} from './response.type';

export class JsonResponse<T extends BaseResponse> {
  responseMessage(): string {
    return 'OK';
  }

  json(response?: ResponseSchema | BaseModel): ResponseSchema;
  json(response?: ListResponse<T>): ListResponse<T>;
  json(response?: ItemResponse<T>): ItemResponse<T>;

  json(
    response?: ResponseSchema | BaseModel | ItemResponse<T> | ListResponse<T>,
  ): ResponseSchema | ItemResponse<T> | ListResponse<T> {
    const res: ResponseSchema | BaseModel | ItemResponse<T> | ListResponse<T> =
      response ?? {
        status: HttpStatus.OK,
      };

    const responseClass: ClassConstructor<T> =
      Object.getPrototypeOf(this).constructor;

    // Handle list of items response
    if (
      (res as ListResponse<T>).data &&
      Array.isArray((res as ListResponse<T>).data)
    ) {
      return {
        message: this.responseMessage(),
        status: HttpStatus.OK,
        data: (res as ListResponse<T>).data.map((_i: GObj) => {
          try {
            return (_i as BaseModel).transform(responseClass);
          } catch {
            return _i;
          }
        }),
        meta: (res as ListResponse<T>).meta,
      };
    }

    // Handle single item response
    if (res instanceof BaseModel) {
      return {
        message: this.responseMessage(),
        status: HttpStatus.OK,
        data: res.transform(responseClass),
      };
    } else if (res.data instanceof BaseModel) {
      return {
        message: this.responseMessage(),
        status: HttpStatus.OK,
        data: res.data.transform(responseClass),
      };
    }

    // General response handling
    res.data = res.data || {};
    res.message = res.message || this.responseMessage();

    return res;
  }
}
