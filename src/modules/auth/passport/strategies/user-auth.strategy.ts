import { Env } from '@lib/utils/env';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { User } from 'src/entities/users/user.entity';
import { BaseAuthenticatableModel } from 'src/lib/entities/authenticatable.entity';
import { IJwtPayload } from '../../types/jwt-payload.interface';
import { UserAccessTokenResponse } from '../responses/user-access-token.response';
import { LocalAuthStrategy } from './local.strategy';

@Injectable()
export class UserAuthStrategy extends LocalAuthStrategy('user', {
  sessionMinutes: Env.get('USER_SESSION_MINUTES').asInt({ min: 1 }),
}) {
  parseUser(accessToken: UserAccessTokenResponse): BaseAuthenticatableModel {
    const p = plainToClass(User, accessToken.user);

    return p;
  }

  async validate(request: Request, payload: IJwtPayload) {
    const user = await super.validate(request, payload);

    if (payload.type !== 'user') {
      return;
    }

    return user;
  }
}
