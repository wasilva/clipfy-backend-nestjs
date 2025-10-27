import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../database/entities/user.entity';

export type PublicUser = Omit<UserEntity, 'passwordHash'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async create(email: string, passwordHash: string, name?: string): Promise<PublicUser> {
    const user = this.repo.create({ email: email.toLowerCase(), name, passwordHash });
    const saved = await this.repo.save(user);
    return this.toPublic(saved);
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.repo.findOne({ where: { email: email.toLowerCase() } }) as Promise<UserEntity | undefined>;
  }

  async findById(id: string): Promise<UserEntity | undefined> {
    return this.repo.findOne({ where: { id } }) as Promise<UserEntity | undefined>;
  }

  toPublic(user: UserEntity): PublicUser {
    const { passwordHash, ...pub } = user as any;
    return pub as PublicUser;
  }
}
