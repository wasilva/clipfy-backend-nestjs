import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { JobEntity } from './job.entity';

@Entity('clips')
export class ClipEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => JobEntity, (job) => job.clips, { onDelete: 'CASCADE' })
  job!: JobEntity;

  @Column({ name: 'start_sec', type: 'int' })
  startSec!: number;

  @Column({ name: 'end_sec', type: 'int' })
  endSec!: number;

  @Column({ type: 'text', nullable: true })
  caption?: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  aspect?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}

