import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException, Query, Body, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadService } from './upload.service';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

class UploadResponseDto {
  job_id!: string;
  status!: string;
  url!: string;
  key!: string;
}

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly upload: UploadService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'defer', required: false, description: 'If true, do not start processing automatically' })
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @ApiOkResponse({ type: UploadResponseDto })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Query('defer') defer?: string): Promise<UploadResponseDto> {
    if (!file) throw new BadRequestException('file is required');
    const result = await this.upload.handleUpload(file, defer === 'true');
    return result as UploadResponseDto;
  }
}
