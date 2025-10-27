export interface JobStatusResponse {
  job_id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  error?: string;
}

