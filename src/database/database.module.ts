import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JobEntity } from './entities/job.entity';
import { ClipEntity } from './entities/clip.entity';
import { PublicationEntity } from './entities/publication.entity';

function parseDatabaseUrl(url?: string) {
  if (!url) return null;
  const u = new URL(url);
  const [username, password] = [u.username, u.password];
  const [host, port] = [u.hostname, Number(u.port || '5432')];
  const database = u.pathname.replace(/^\//, '') || 'postgres';
  return { host, port, username, password, database };
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const parsed = parseDatabaseUrl(process.env.DATABASE_URL);
        const cfg = parsed || {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        };

        if (!cfg.host || !cfg.port || !cfg.username || !cfg.database) {
          throw new Error(
            'Database configuration missing. Set DATABASE_URL or DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME in .env',
          );
        }

        return {
          type: 'postgres' as const,
          host: cfg.host,
          port: cfg.port as number,
          username: cfg.username as string,
          password: (cfg as any).password,
          database: cfg.database as string,
          entities: [UserEntity, JobEntity, ClipEntity, PublicationEntity],
          synchronize: true, // DEV only; use migrations in prod
          logging: false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
