import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ClipEntity } from './clip.entity';
import { PublishPlatform } from '../../config/platforms';

@Entity('publications')
export class PublicationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ClipEntity, { onDelete: 'CASCADE' })
  clip!: ClipEntity;

  @Column({ type: 'varchar', length: 50 })
  platform!: PublishPlatform;

  @Column({ name: 'external_url', type: 'text', nullable: true })
  externalUrl?: string | null;

  @Column({ type: 'varchar', length: 20, default: 'mocked' })
  status!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}

