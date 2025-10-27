import { Injectable, ServiceUnavailableException, BadRequestException } from '@nestjs/common';
import { S3StorageService } from '../storage/s3.service';
import { JobsService } from '../jobs/jobs.service';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  constructor(private readonly s3: S3StorageService, private readonly jobs: JobsService) {}

  async handleUpload(file: Express.Multer.File, defer: boolean, userId?: string) {
    const ext = (file.originalname.split('.').pop() || 'bin').toLowerCase();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]+/g, '_').slice(0, 80);
    const key = `raw/${safeName.replace(/\s+/g, '_').replace(/^_+/, '')}_${randomUUID().slice(0,8)}.${ext}`;
    const maxMb = Number(process.env.MAX_UPLOAD_SIZE_MB || '512');
    const maxBytes = maxMb * 1024 * 1024;
    if (file.size && file.size > maxBytes) {
      throw new BadRequestException(`file too large: limit ${maxMb}MB`);
    }
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
      const job = await this.jobs.createUploadedJob(url, userId);
      return { job_id: job.job_id, status: 'uploaded', url, key };
    }

    const { job_id } = await this.jobs.ingest(url);
    return { job_id, status: 'queued', url, key };
  }
}
