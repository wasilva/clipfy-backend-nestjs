import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { ClipEntity } from './clip.entity';

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';

@Entity('jobs')
export class JobEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => UserEntity, { nullable: true })
  user?: UserEntity | null;

  @Column({ name: 'source_url', type: 'varchar', length: 2048 })
  sourceUrl!: string;

  @Column({ type: 'varchar', length: 20 })
  status!: JobStatus;

  @Column({ type: 'text', nullable: true })
  error?: string | null;

  @OneToMany(() => ClipEntity, (clip) => clip.job)
  clips!: ClipEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}

