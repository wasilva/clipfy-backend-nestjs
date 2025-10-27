import { IsString } from 'class-validator';
import { IsSupportedUrl } from '../../common/validators/is-supported-url';

export class IngestDto {
  @IsString()
  @IsSupportedUrl({ message: 'source_url must be https and from supported platforms (YouTube, TikTok, Instagram)' })
  source_url!: string;
}
