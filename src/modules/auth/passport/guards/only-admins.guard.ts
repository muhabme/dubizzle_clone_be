import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthGuard } from './auth.guard';

@Injectable()
export class OnlyAdmins extends AuthGuard('admin') {
  constructor(reflector: Reflector) {
    super(reflector);
  }
}
