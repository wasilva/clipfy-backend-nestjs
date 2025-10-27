import { Injectable, ServiceUnavailableException, BadRequestException } from '@nestjs/common';
import { S3StorageService } from '../storage/s3.service';
import { JobsService } from '../jobs/jobs.service';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  constructor(private readonly s3: S3StorageService, private readonly jobs: JobsService) {}

  async handleUpload(file: Express.Multer.File, defer: boolean) {
    const ext = (file.originalname.split('.').pop() || 'bin').toLowerCase();
    const key = `raw/${randomUUID()}.${ext}`;
    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('empty or invalid file');
    }
    let url: string;
    try {
      const res = await this.s3.upload(key, file.buffer, file.mimetype);
      url = res.url;
    } catch (e: any) {
      const detail = Array.isArray(e?.errors)
        ? e.errors.map((x: any) => x?.message || String(x)).join(' | ')
        : (e?.message || String(e));
      throw new ServiceUnavailableException(`storage upload failed: ${detail}`);
    }

    if (defer) {
      const job = await this.jobs.createUploadedJob(url);
      return { job_id: job.job_id, status: 'uploaded', url, key };
    }

    const { job_id } = await this.jobs.ingest(url);
    return { job_id, status: 'queued', url, key };
  }
}
