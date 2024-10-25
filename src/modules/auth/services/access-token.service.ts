import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain, plainToClass } from 'class-transformer';
import * as dayjs from 'dayjs';
import * as toMilliseconds from 'ms';
import { AccessToken } from 'src/entities/access-token/access-token.entity';
import { User } from 'src/entities/users/user.entity';
import { CrudService } from 'src/lib/services/crud.service';
import { Env } from 'src/lib/utils/env';
import { IJwtPayload } from '../types/jwt-payload.interface';

@Injectable()
export class AccessTokenService extends CrudService<AccessToken> {
  constructor(private jwtService: JwtService) {
    super({ entity: AccessToken });
  }

  static getExpiresInMs(): number {
    return toMilliseconds(Env.get('JWT_EXPIRES_IN').asString());
  }

  async generateToken(user: User) {
    const expiresIn = AccessTokenService.getExpiresInMs();
    const accessToken = await this.createToken({ user, expiresIn });

    const payload: IJwtPayload = {
      id: accessToken.getUser().uuid,
      type: accessToken.user_type,
      tokenId: accessToken.uuid,
    };

    return this.jwtService.sign(payload);
  }

  protected async createToken({
    user,
    expiresIn,
  }: {
    user: User;
    expiresIn: number;
  }) {
    const accessToken = await this.create({
      user_id: user.id,
      user_type: user.type,
      expires_at: new Date(Date.now() + expiresIn),
      user,
    });

    accessToken.setUser(instanceToPlain(user) as User);

    return accessToken;
  }

  async validateSessionLength(
    accessToken: AccessToken,
    sessionMinutes: number,
  ) {
    accessToken = plainToClass(
      AccessToken as unknown as ClassConstructor<AccessToken>,
      accessToken,
    );

    if (
      dayjs(accessToken.last_used_at ?? dayjs()).isBefore(
        dayjs().subtract(sessionMinutes, 'minutes'),
      )
    ) {
      throw new UnauthorizedException();
    }

    accessToken.last_used_at = dayjs().toDate();
    accessToken.save();

    return accessToken;
  }
}
