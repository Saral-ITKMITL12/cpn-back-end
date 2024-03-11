// file-upload.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UploadService {
  constructor(
    @InjectQueue('file-upload') private fileUploadQueue: Queue,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    const fileUploadJob = await this.fileUploadQueue.add({
      file: {
        originalname: file.originalname,
        buffer: file.buffer,
      },
    });

    // Send email notification
    await this.emailService.sendFileUploadNotification(file.originalname);

    return { jobId: fileUploadJob.id };
  }

  async uploadFiles(files: Array<Express.Multer.File>, req: Request) {
    const fileUploadJobs = [];

    for (const file of files) {
      const fileUploadJob = await this.fileUploadQueue.add({
        file: {
          originalname: file.originalname,
          buffer: file.buffer,
        },
        // user: req.user, // Assuming user data is available in the request object
      });
      fileUploadJobs.push(fileUploadJob.id);
    }

    // Send email notification
    await this.emailService.sendFileUploadNotification(files.map((file) => file.originalname));

    return { jobIds: fileUploadJobs };
  }
}