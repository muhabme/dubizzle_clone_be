/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy, type Type } from '@nestjs/passport';
import type { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { AccessToken } from 'src/entities/access-token/access-token.entity';
import { BaseAuthenticatableModel } from 'src/lib/entities/authenticatable.entity';
import { AccessTokenService } from '../../services/access-token.service';
import { IJwtPayload } from '../../types/jwt-payload.interface';

export function LocalAuthStrategy<T extends Type<any> = any>(
  name?: string | undefined,
  options?: {
    callbackArity?: true | number;
    sessionMinutes?: number;
  },
): new (...args) => InstanceType<T> {
  abstract class BaseLocalAuthStrategy extends PassportStrategy(
    Strategy,
    name,
    options?.callbackArity,
  ) {
    protected sessionMinutes: number;

    constructor(
      @Inject(ConfigService) configService: ConfigService,
      protected tokenService: AccessTokenService,
    ) {
      super({
        jwtFromRequest: (request: Request) => request.cookies.access_token,
        secretOrKey: configService.get('jwt.secret'),
        passReqToCallback: true,
      });

      this.sessionMinutes = options?.sessionMinutes ?? 5;
    }

    abstract parseUser(
      accessToken: AccessToken,
    ): BaseAuthenticatableModel | Promise<BaseAuthenticatableModel | undefined>;

    async validate(
      request: Request,
      payload: IJwtPayload,
    ): Promise<BaseAuthenticatableModel | undefined> {
      const accessToken = await this.tokenService.findOne({
        where: {
          uuid: payload.tokenId,
          user_type: payload.type,
        },
        relations: ['user'],
      });

      if (!accessToken) throw new UnauthorizedException('Unauthorized');

      await this.tokenService.validateSessionLength(
        accessToken,
        this.sessionMinutes,
      );

      // inject the access token into the request object without causing a type error
      (request as unknown as { accessToken: AccessToken }).accessToken =
        accessToken;

      return this.parseUser(accessToken);
    }
  }

  return BaseLocalAuthStrategy as T;
}
