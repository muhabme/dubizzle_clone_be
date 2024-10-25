import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthGuard } from './auth.guard';

@Injectable()
export class AdminsOrUsers extends AuthGuard(['admin', 'user']) {
  constructor(reflector: Reflector) {
    super(reflector);
  }
}
