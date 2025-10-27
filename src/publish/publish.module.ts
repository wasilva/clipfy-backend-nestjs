import { Module } from '@nestjs/common';
import { PublishController } from './publish.controller';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [JobsModule],
  controllers: [PublishController],
})
export class PublishModule {}

