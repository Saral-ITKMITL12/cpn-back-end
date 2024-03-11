import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get<string>('email.host'),
      port: configService.get<number>('email.port'),
      secure: configService.get<boolean>('email.secure'),
      auth: {
        user: configService.get<string>('email.user'),
        pass: configService.get<string>('email.password'),
      },
    });
  }

  async sendFileUploadNotification(fileNames: string | string[]): Promise<void> {
    const recipients = this.configService.get<string>('email.recipients');

    const mailOptions = {
      from: this.configService.get<string>('email.sender'),
      to: recipients,
      subject: 'File Upload Notification',
      text: `The following file(s) have been uploaded: ${Array.isArray(fileNames) ? fileNames.join(', ') : fileNames}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email notification:', error);
      throw error;
    }
  }
}