import {
  UnauthorizedException,
  type ExecutionContext,
  type Type,
} from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import type { IAuthGuard } from '@nestjs/passport';
import { AuthGuard as BaseAuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/lib/decorators/public.decorator';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function AuthGuard<T extends Type<any> = any>(
  type?: string | string[],
): new (...args) => InstanceType<T> {
  class AppAuthGuard extends BaseAuthGuard(type) implements IAuthGuard {
    constructor(private reflector: Reflector) {
      super();
    }

    canActivate(context: ExecutionContext) {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (isPublic) {
        return true;
      }

      return super.canActivate(context);
    }

    handleRequest(err, user, info) {
      // if (Array.isArray(info)) {
      //   abortIf(info[0]?.name === 'TokenExpiredError', TokenExpired.throw());
      //   abortIf(info[0]?.name === 'ForbiddenException', ForbiddenException.throw());
      // }

      // abortIf(info?.name === 'TokenExpiredError', TokenExpired.throw());
      // abortIf(info?.name === 'ForbiddenException', ForbiddenException.throw());

      if (err || !user) {
        throw err || new UnauthorizedException('Unauthorized');
      }

      return user;
    }

    getRequest(context: ExecutionContext) {
      return context.switchToHttp().getRequest();
    }

    getResponse(context: ExecutionContext) {
      return context.switchToHttp().getResponse();
    }
  }

  return AppAuthGuard as T;
}
