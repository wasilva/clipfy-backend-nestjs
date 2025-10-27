import { ApiProperty } from '@nestjs/swagger';

export class PublishResponseDto {
  @ApiProperty()
  job_id!: string;

  @ApiProperty({ type: Object, additionalProperties: { type: 'string' } as any })
  published!: Record<string, string>;
}

