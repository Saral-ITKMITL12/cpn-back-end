import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = process.env.STORAGE_UPLOAD_DIR || './uploads';
    this.ensureUploadDirExists();
  }

  private ensureUploadDirExists(): void {
    const uploadDirPath = path.resolve(this.uploadDir);
    if (!fs.existsSync(uploadDirPath)) {
      fs.mkdirSync(uploadDirPath, { recursive: true });
    }
  }

  async uploadFile(fileName: string, fileBuffer: Buffer, user?: any): Promise<string> {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error('File buffer is empty');
    }

    const fileExtension = path.extname(fileName);
    const filePrefix = `${user?.id || ''}`;
    const uniqueFileName = `${filePrefix}-${uuidv4()}${fileExtension}`;
    const filePath = path.join(this.uploadDir, uniqueFileName);

    try {
      await fsPromises.writeFile(filePath, fileBuffer);
      return uniqueFileName;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
}