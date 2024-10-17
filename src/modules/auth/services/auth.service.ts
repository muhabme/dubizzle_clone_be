import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateGoogleUser(data: {
    googleId: string;
    email: string;
    full_name: string;
    name?: string;
  }) {
    let user = await this.usersService.findByEmail(data.email);
    if (!user) {
      user = await this.usersService.createUser({
        googleId: data.googleId,
        email: data.email,
        full_name: data.full_name,
        name: data.name,
      });
    }
    return user;
  }
}
