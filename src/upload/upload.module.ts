import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { S3StorageService } from '../storage/s3.service';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [JobsModule],
  controllers: [UploadController],
  providers: [UploadService, S3StorageService],
})
export class UploadModule {}

