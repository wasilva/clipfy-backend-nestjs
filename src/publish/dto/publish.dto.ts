import { IsArray, IsString, ArrayNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PublishPlatform } from '../../config/platforms';

export class PublishDto {
  @IsString()
  job_id!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(PublishPlatform, { each: true })
  @ApiProperty({ enum: PublishPlatform, isArray: true, description: 'Target platforms to publish the clips' })
  platforms!: PublishPlatform[]; // e.g., ['youtube_shorts','tiktok','instagram_reels']
}
