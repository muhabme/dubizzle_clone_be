import { Expose } from 'class-transformer';
import { BaseResponse } from 'src/lib/responses/base.response';

export class CategoryItemResponse<T extends BaseResponse> {
  data: T;

  constructor(data: T) {
    this.data = data;
  }

  getJson() {
    return this.data;
  }

  @Expose({ name: 'some_property' })
  someProperty: string;
}
