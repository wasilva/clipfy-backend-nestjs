import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { IngestDto } from './dto/ingest.dto';
import { JobStatusResponseDto } from './dto/job-status.dto';
import { ClipDto } from './dto/clip.dto';
import { ApiOkResponse, ApiTags, ApiOperation, ApiNotFoundResponse, ApiBadRequestResponse } from '@nestjs/swagger';

@ApiTags('jobs')
@Controller()
export class JobsController {
  constructor(private readonly jobs: JobsService) {}

  @Post('ingest')
  @ApiOperation({ summary: 'Create a new ingest job from a supported video URL' })
  @ApiOkResponse({ type: JobStatusResponseDto, description: 'Returns job id and initial status' })
  @ApiBadRequestResponse({ description: 'Validation error: invalid or unsupported source_url' })
  async ingest(@Body() dto: IngestDto): Promise<JobStatusResponseDto> {
    return this.jobs.ingest(dto.source_url);
  }

  @Get('jobs/:jobId')
  @ApiOperation({ summary: 'Get the current status of a job' })
  @ApiOkResponse({ type: JobStatusResponseDto })
  @ApiNotFoundResponse({ description: 'Job not found' })
  async status(@Param('jobId') jobId: string): Promise<JobStatusResponseDto> {
    const st = await this.jobs.getStatus(jobId);
    if (!st) throw new NotFoundException('job not found');
    return st;
  }

  @Get('jobs/:jobId/clips')
  @ApiOperation({ summary: 'List generated clips for a completed job' })
  @ApiOkResponse({ type: ClipDto, isArray: true })
  @ApiNotFoundResponse({ description: 'Clips not found or job not completed' })
  async clips(@Param('jobId') jobId: string): Promise<ClipDto[]> {
    const clips = await this.jobs.getClips(jobId);
    if (!clips) throw new NotFoundException('clips not found or job not completed');
    return clips as any;
  }

  @Post('jobs/:jobId/process')
  @ApiOperation({ summary: 'Trigger processing for an uploaded job' })
  @ApiOkResponse({ type: JobStatusResponseDto })
  async process(@Param('jobId') jobId: string): Promise<JobStatusResponseDto> {
    const st = await this.jobs.trigger(jobId);
    if (!st) throw new NotFoundException('job not found');
    return st as any;
  }
}
