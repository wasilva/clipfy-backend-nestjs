export interface JobStatusResponse {
  job_id: string;
  status: 'uploaded' | 'queued' | 'processing' | 'completed' | 'failed';
  error?: string;
}
