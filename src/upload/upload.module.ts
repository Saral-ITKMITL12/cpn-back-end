import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadProcessor } from './upload.processor';
import { UploadController } from './upload.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { StorageModule } from '../storage/storage.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'file-upload',
      useFactory: async () => ({
        redis: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT, 10),
        },
      }),
    }),
    StorageModule,
    EmailModule,
  ],
  controllers: [UploadController],
  providers: [UploadService, UploadProcessor],
})
export class UploadModule {}