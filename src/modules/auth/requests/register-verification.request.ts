import { IsEmail } from 'class-validator';

import { User } from 'src/entities/users/user.entity';
import { IsUnique } from 'src/lib/rules/is-unique.rule';

export class RegisterVerificationRequest {
  @IsEmail()
  @IsUnique({ entity: User })
  email?: string;
}
