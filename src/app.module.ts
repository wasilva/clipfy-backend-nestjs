import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { JobsModule } from './jobs/jobs.module';
import { PublishModule } from './publish/publish.module';
import { QueueModule } from './queue/queue.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    HealthModule,
    JobsModule,
    PublishModule,
    QueueModule,
    AuthModule,
    UploadModule,
  ],
})
export class AppModule {}
