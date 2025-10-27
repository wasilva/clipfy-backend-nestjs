import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { PublishDto } from './dto/publish.dto';
import { JobsService } from '../jobs/jobs.service';
import { randomUUID } from 'crypto';
import { ApiOkResponse, ApiTags, ApiOperation, ApiBadRequestResponse } from '@nestjs/swagger';
import { PublishResponseDto } from './dto/publish-response.dto';

@ApiTags('publish')
@Controller('publish')
export class PublishController {
  constructor(private readonly jobs: JobsService) {}

  @Post()
  @ApiOperation({ summary: 'Publish generated clips to selected platforms' })
  @ApiOkResponse({ type: PublishResponseDto, description: 'Returns mock URLs for each target platform' })
  @ApiBadRequestResponse({ description: 'Validation error: invalid job_id or unsupported platform' })
  async publish(@Body() dto: PublishDto): Promise<PublishResponseDto> {
    const clips = await this.jobs.getClips(dto.job_id);
    if (!clips) throw new NotFoundException('job/clips not found');
    const published: Record<string, string> = {};
    for (const platform of dto.platforms) {
      published[platform] = `mock://${platform}/${randomUUID()}`;
    }
    return { job_id: dto.job_id, published };
  }
}
