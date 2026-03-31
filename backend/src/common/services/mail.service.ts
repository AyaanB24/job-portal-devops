import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string, companyName: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:8080';
    const verifyUrl = `${frontendUrl}/verify-company?token=${token}`;

    const mailOptions = {
      from: this.configService.get('MAIL_FROM'),
      to: email,
      subject: '🏢 Verify Your Company Registration - NexusCore',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 20px;">
          <h1 style="color: #3b82f6; font-size: 28px;">Welcome to the Nexus, ${companyName}!</h1>
          <p style="font-size: 16px; line-height: 1.6;">You're just one step away from accessing the neural network of elite engineering talent.</p>
          <div style="margin: 40px 0;">
            <a href="${verifyUrl}" style="background-color: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">VERIFY COMPANY IDENTITY</a>
          </div>
          <p style="font-size: 14px; color: #94a3b8;">If you didn't initiate this registration, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #1e293b; margin: 30px 0;" />
          <p style="font-size: 12px; color: #64748b;">© 2026 NEXUSCORE PROTOCOL. ALL RIGHTS RESERVED.</p>
        </div>
      `,
    };

    try {
      if (this.configService.get('MAIL_USER') === 'your_email@gmail.com') {
        console.log('--- DEVELOPMENT MAIL FALLBACK ---');
        console.log('Recipient:', email);
        console.log('Verification URL:', verifyUrl);
        console.log('---------------------------------');
      } else {
        await this.transporter.sendMail(mailOptions);
        console.log(`Verification email dispatched to ${email}`);
      }
    } catch (error) {
      console.error('Email sending failed (Development Fallback active):', error);
      console.log('Verification token for manual testing:', token);
    }
  }
}
