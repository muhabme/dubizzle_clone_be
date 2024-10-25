import { BaseResponse } from './base.response';

export type GKey = string | number | symbol;
export type GObj = Record<GKey, any>;

export interface ResponseMeta {
  total: number;
  currentPage: number;
  eachPage: number;
  lastPage: number;
}

export interface ResponseSchema {
  status?: number;
  message?: string;
  data?: GObj;
}

// single item response
export interface ItemResponse<T extends BaseResponse> extends ResponseSchema {
  data: T;
}

// list items response
export interface ListResponse<T extends BaseResponse> extends ResponseSchema {
  data: T[];
  meta: ResponseMeta;
}

export interface ErrorResponse extends ResponseSchema {
  exception: string;
  errors?: GObj[] | null;
}
