import { Expose, Type } from 'class-transformer';
import { User } from 'src/entities/users/user.entity';
import { AccessTokenResponse } from './access-token.response';

export class UserAccessTokenResponse extends AccessTokenResponse {
  @Expose({ name: 'user' })
  @Type(() => User)
  user: User;
}
