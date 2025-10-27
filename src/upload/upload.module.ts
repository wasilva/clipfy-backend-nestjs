import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { S3StorageService } from '../storage/s3.service';
import { StorageController } from '../storage/storage.controller';
import { JobsModule } from '../jobs/jobs.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [JobsModule, AuthModule],
  controllers: [UploadController, StorageController],
  providers: [UploadService, S3StorageService],
})
export class UploadModule {}
