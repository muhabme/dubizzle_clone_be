import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.example.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'your-email@example.com', // Your email address
        pass: 'your-email-password', // Your email password
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string): Promise<void> {
    const mailOptions: MailOptions = {
      from: 'your-email@example.com', // Sender address
      to,
      subject,
      text,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendPasswordResetMail(user: { email: string; full_name: string }, token: string): Promise<void> {
    const subject = 'Password Reset Request';
    const text = `Hello ${user.full_name},

You requested a password reset. Please use the following link to reset your password:

http://example.com/reset-password?token=${token}

If you didn't request this, please ignore this email.
`;

    await this.sendMail(user.email, subject, text);
  }
}