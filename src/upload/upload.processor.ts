import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { StorageService } from 'src/storage/storage.service';


@Processor('file-upload')
export class UploadProcessor {
  constructor(private readonly storageService: StorageService) {}

  @Process()
  async processFileUpload(job: Job<{ file: { originalname: string; buffer: Buffer }; user?: any }>) {
    const { file, user } = job.data;
    await this.storageService.uploadFile(file.originalname, file.buffer, user);
  }
}