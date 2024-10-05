import { Expose } from 'class-transformer';
import { JsonResponse } from 'src/lib/responses/base.response';
import { BaseResponse } from 'src/lib/responses/base.response';

export class CategoryItemResponse<T extends BaseResponse> extends JsonResponse<T> {
  @Expose({ name: 'some_property' })
  someProperty: string;
}
