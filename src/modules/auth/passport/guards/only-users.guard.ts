import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthGuard } from './auth.guard';

@Injectable()
export class OnlyUsers extends AuthGuard('user') {
  constructor(reflector: Reflector) {
    super(reflector);
  }
}
