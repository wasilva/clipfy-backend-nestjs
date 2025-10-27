import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class JobStatusResponseDto {
  @ApiProperty()
  job_id!: string;

  @ApiProperty({ enum: ['uploaded', 'queued', 'processing', 'completed', 'failed'] })
  status!: 'uploaded' | 'queued' | 'processing' | 'completed' | 'failed';

  @ApiPropertyOptional()
  error?: string;
}
