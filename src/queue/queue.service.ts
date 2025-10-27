import { Injectable, Logger } from '@nestjs/common';
import type { Queue, Worker, Job } from 'bullmq';
import { SUPPORTED_HOSTS } from '../config/platforms';

type IngestPayload = { source_url: string; job_id?: string };

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);
  private _queue?: Queue<IngestPayload>;
  private _worker?: Worker<IngestPayload>;
  private _enabled = false;

  constructor() {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      this.logger.log('REDIS_URL not set; queue disabled (fallback to in-memory)');
      return;
    }
    try {
      const { Queue, Worker } = require('bullmq') as typeof import('bullmq');
      const connection = this.parseRedisUrl(redisUrl);
      this._queue = new Queue<IngestPayload>('ingest', { connection });
      // Worker registration will be done by JobsService to get callbacks
      this._worker = undefined;
      this._enabled = true;
      this.logger.log('BullMQ queue enabled');
    } catch (e) {
      this.logger.error(`Failed to init BullMQ: ${e}`);
      this._enabled = false;
    }
  }

  get enabled() {
    return this._enabled;
  }

  async addIngestJob(payload: IngestPayload) {
    if (!this._queue) throw new Error('Queue not initialized');
    return this._queue.add('ingest', payload, { removeOnComplete: 100, removeOnFail: 100 });
  }

  registerWorker(processor: (job: Job<IngestPayload>) => Promise<void>) {
    if (!this._enabled) return;
    const { Worker } = require('bullmq') as typeof import('bullmq');
    const redisUrl = process.env.REDIS_URL!;
    const connection = this.parseRedisUrl(redisUrl);
    this._worker = new Worker<IngestPayload>('ingest', processor, { connection });
    this._worker.on('failed', (job, err) => {
      this.logger.error(`Job ${job?.id} failed: ${err?.message}`);
    });
  }

  private parseRedisUrl(url: string) {
    // supports redis://:password@host:port/db
    const u = new URL(url);
    return {
      host: u.hostname,
      port: Number(u.port || '6379'),
      password: u.password || undefined,
      db: Number(u.pathname?.replace('/', '') || '0'),
    };
  }
}
