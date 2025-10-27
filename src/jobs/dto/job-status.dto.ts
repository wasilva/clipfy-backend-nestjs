import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class JobStatusResponseDto {
  @ApiProperty()
  job_id!: string;

  @ApiProperty({ enum: ['queued', 'processing', 'completed', 'failed'] })
  status!: 'queued' | 'processing' | 'completed' | 'failed';

  @ApiPropertyOptional()
  error?: string;
}

