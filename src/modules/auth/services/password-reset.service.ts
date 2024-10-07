import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new Error('User not found');
    // Generate reset token
    const token = 'some-unique-token';
    user.resetToken = token;
    await this.usersService.saveUser(user);
    // Send email with reset instructions
    await this.mailService.sendPasswordResetMail(user, token);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.usersService.findByResetToken(token);
    if (!user) throw new Error('Invalid or expired token');
    user.password = newPassword; // You should hash this password before saving
    user.resetToken = null;
    await this.usersService.saveUser(user);
  }
}
