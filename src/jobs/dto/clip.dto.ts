import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClipDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: Number })
  start_sec!: number;

  @ApiProperty({ type: Number })
  end_sec!: number;

  @ApiPropertyOptional()
  caption?: string;

  @ApiPropertyOptional({ example: '9:16' })
  aspect?: string;
}

