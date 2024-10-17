import { JsonResponse } from '@lib/responses/json.response';

export class PreSignedUrlResponse extends JsonResponse<{}> {
  url: string;

  fields: {
    bucket: string;
    key: string;
    Policy: string;
    'content-type': string;
    'X-Amz-Algorithm': string;
    'X-Amz-Credential': string;
    'X-Amz-Date': string;
    'X-Amz-Signature': string;
  };
}
