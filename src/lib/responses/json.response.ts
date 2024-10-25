import { HttpStatus } from '@nestjs/common';
import { BaseEntity } from 'typeorm';
import { BaseModel } from '../entities/base.entity';
import { ModelCollection } from '../utils/model-collection.entity';
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
  json(
    response?: ModelCollection<BaseEntity> | ListResponse<T>,
  ): ListResponse<T>;
  json(response?: ListResponse<T>): ListResponse<T>;
  json(response?: ItemResponse<T>): ItemResponse<T>;

  json(
    response?:
      | ResponseSchema
      | BaseModel
      | ModelCollection<BaseEntity>
      | ItemResponse<T>
      | ListResponse<T>,
  ): ResponseSchema | ItemResponse<T> | ListResponse<T> {
    const res = response ?? {
      status: HttpStatus.OK,
    };

    // get class of the current instance
    const responseClass: ClassConstructor<BaseResponse> =
      Object.getPrototypeOf(this).constructor;

    if (res instanceof ModelCollection) {
      return {
        message: this.responseMessage(),
        status: HttpStatus.OK,
        data: res.items.map((_i: GObj) => {
          try {
            return (_i as BaseModel).transform(responseClass);
          } catch {
            return _i;
          }
        }),
        meta: res.meta,
      };
    }

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

    if (res instanceof BaseModel) {
      return {
        message: this.responseMessage(),
        status: HttpStatus.OK,
        data: res.transform(responseClass),
      };
    }

    res.data = res.data || {};
    res.message = res.message || this.responseMessage();

    return res;
  }
}
