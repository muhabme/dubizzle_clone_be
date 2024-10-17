import { JsonResponse } from '@lib/responses/json.response';
import { Expose } from 'class-transformer';

export class MediaResponse extends JsonResponse<{}> {
  @Expose({ name: 'code' })
  media: string;
}
