import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from '../database/entities/job.entity';
import { ClipEntity } from '../database/entities/clip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobEntity, ClipEntity])],
  providers: [JobsService],
  controllers: [JobsController],
  exports: [JobsService],
})
export class JobsModule {}
