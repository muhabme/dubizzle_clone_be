import { Expose } from 'class-transformer';
import { BaseResponse } from 'src/lib/responses/base.response';

export class ListCategoriesResponse<T extends BaseResponse[]> {
  data: T;

  constructor(data: T) {
    this.data = data;
  }

  getJson() {
    return { data: this.data };
  }

  @Expose({ name: 'some_property' })
  someProperty: string;
}
