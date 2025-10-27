import { Injectable } from '@nestjs/common';
import type { JobStatusResponse } from './interfaces/job-status.interface';
import type { Clip } from './interfaces/clip.interface';
import { randomUUID } from 'crypto';
import { QueueService } from '../queue/queue.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobEntity } from '../database/entities/job.entity';
import { ClipEntity } from '../database/entities/clip.entity';

type Job = {
  status: JobStatusResponse['status'];
  source_url: string;
  error?: string;
};

@Injectable()
export class JobsService {
  private readonly JOBS = new Map<string, Job>();
  private readonly CLIPS = new Map<string, Clip[]>();
  private readonly useQueue: boolean;

  constructor(
    private readonly queue: QueueService,
    @InjectRepository(JobEntity) private readonly jobsRepo: Repository<JobEntity>,
    @InjectRepository(ClipEntity) private readonly clipsRepo: Repository<ClipEntity>,
  ) {
    this.useQueue = queue.enabled;
    if (this.useQueue) {
      this.queue.registerWorker(async (qjob) => {
        const { source_url, job_id } = qjob.data as { source_url: string; job_id?: string };
        const id = job_id || String(qjob.id);
        await this.process(id, source_url);
      });
    }
  }

  async ingest(source_url: string): Promise<JobStatusResponse> {
    // Create job in DB
    const entity = this.jobsRepo.create({ sourceUrl: source_url, status: 'queued' });
    const saved = await this.jobsRepo.save(entity);
    const job_id = saved.id;
    // Fallback in-memory mirrors
    this.JOBS.set(job_id, { status: 'queued', source_url });

    if (this.useQueue) {
      this.queue.addIngestJob({ source_url, job_id }).catch(() => {
        setTimeout(() => this.process(job_id, source_url), 50);
      });
    } else {
      setTimeout(() => this.process(job_id, source_url), 100);
    }

    return { job_id, status: 'queued' };
  }

  async getStatus(job_id: string): Promise<JobStatusResponse | undefined> {
    const j = await this.jobsRepo.findOne({ where: { id: job_id } });
    if (!j) return undefined;
    return { job_id, status: j.status as any, error: j.error || undefined };
  }

  async getClips(job_id: string): Promise<Clip[] | undefined> {
    const rows = await this.clipsRepo.find({ where: { job: { id: job_id } as any }, order: { createdAt: 'ASC' } });
    if (!rows || rows.length === 0) return undefined;
    return rows.map((r) => ({ id: r.id, start_sec: r.startSec, end_sec: r.endSec, caption: r.caption || undefined, aspect: r.aspect || undefined }));
  }

  private async process(job_id: string, source_url?: string) {
    const mem = this.JOBS.get(job_id);
    if (!mem && !source_url) return;
    const src = source_url || mem!.source_url;
    if (mem) mem.status = 'processing';

    try {
      const clips = this.runProcessingPipeline(src);
      this.CLIPS.set(job_id, clips);

      // Persist to DB
      const job = await this.jobsRepo.findOne({ where: { id: job_id } });
      if (job) {
        job.status = 'completed';
        await this.jobsRepo.save(job);
        const clipEntities = clips.map((c) =>
          this.clipsRepo.create({
            job,
            startSec: c.start_sec,
            endSec: c.end_sec,
            caption: c.caption,
            aspect: c.aspect,
          }),
        );
        await this.clipsRepo.save(clipEntities);
      }

      if (mem) mem.status = 'completed';
    } catch (e: any) {
      if (mem) {
        mem.status = 'failed';
        mem.error = String(e?.message ?? e);
      }
      const job = await this.jobsRepo.findOne({ where: { id: job_id } });
      if (job) {
        job.status = 'failed';
        job.error = String(e?.message ?? e);
        await this.jobsRepo.save(job);
      }
    }
  }

  async createUploadedJob(source_url: string): Promise<JobStatusResponse> {
    const entity = this.jobsRepo.create({ sourceUrl: source_url, status: 'uploaded' as any });
    const saved = await this.jobsRepo.save(entity);
    this.JOBS.set(saved.id, { status: 'uploaded' as any, source_url });
    return { job_id: saved.id, status: 'uploaded' as any };
  }

  async trigger(job_id: string): Promise<JobStatusResponse | undefined> {
    const job = await this.jobsRepo.findOne({ where: { id: job_id } });
    if (!job) return undefined;
    job.status = 'queued' as any;
    await this.jobsRepo.save(job);
    const mem = this.JOBS.get(job_id) || { status: 'queued' as any, source_url: job.sourceUrl } as any;
    this.JOBS.set(job_id, mem);
    if (this.useQueue) {
      await this.queue.addIngestJob({ source_url: job.sourceUrl, job_id });
    } else {
      setTimeout(() => this.process(job_id, job.sourceUrl), 50);
    }
    return { job_id, status: 'queued' };
  }

  private runProcessingPipeline(source_url: string): Clip[] {
    const windows = this.detectHighlights(source_url);
    const clips: Clip[] = windows.map(([start, end]) => ({
      id: randomUUID(),
      start_sec: start,
      end_sec: end,
      caption: this.generateCaptions(source_url, start, end),
      aspect: '9:16',
    }));
    return clips;
  }

  private detectHighlights(_source_url: string): Array<[number, number]> {
    // TODO: Replace with Whisper + heuristics
    return [
      [15, 45],
      [60, 90],
      [120, 150],
    ];
  }

  private generateCaptions(_source_url: string, start: number, end: number): string {
    // TODO: Integrate Whisper PT-BR
    return `Auto caption from ${start}s to ${end}s`;
  }
}
