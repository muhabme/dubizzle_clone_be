import { Env } from '@lib/utils/env';
import { Injectable } from '@nestjs/common';

import { plainToClass } from 'class-transformer';
import { User } from 'src/entities/users/user.entity';
import { BaseAuthenticatableModel } from 'src/lib/entities/authenticatable.entity';
import { IJwtPayload } from '../../types/jwt-payload.interface';
import { AdminAccessTokenResponse } from '../responses/admin-access-token.response';
import { LocalAuthStrategy } from './local.strategy';

@Injectable()
export class AdminAuthStrategy extends LocalAuthStrategy('admin', {
  sessionMinutes: Env.get('ADMIN_SESSION_MINUTES').asInt({ min: 1 }),
}) {
  parseUser(accessToken: AdminAccessTokenResponse): BaseAuthenticatableModel {
    return plainToClass(User, accessToken.user);
  }

  async validate(request: Request, payload: IJwtPayload) {
    const user = await super.validate(request, payload);

    if (payload.type !== 'admin') {
      return;
    }

    return user;
  }
}
