import { Expose } from 'class-transformer';
import { JsonResponse } from 'src/lib/responses/json.response';
import { decorate, Mixin } from 'ts-mixer';

export class AccessTokenResponse extends JsonResponse<{}> {
  @decorate(Expose({ name: 'uuid' }))
  id: Date;

  @decorate(Expose({ name: 'created_at' }))
  createdAt: Date;

  @decorate(Expose({ name: 'revoked_at' }))
  revokedAt: Date;

  @decorate(Expose({ name: 'expires_at' }))
  expiresAt: Date;
}
