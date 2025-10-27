import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService, PublicUser } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService, private readonly jwt: JwtService) {}

  async register(email: string, password: string, name?: string): Promise<{ token: string; user: PublicUser }> {
    const existing = await this.users.findByEmail(email);
    if (existing) throw new BadRequestException('email already registered');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.users.create(email, passwordHash, name);
    const token = await this.sign(user);
    return { token, user };
  }

  async login(email: string, password: string): Promise<{ token: string; user: PublicUser }> {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('invalid credentials');
    const pub = this.users.toPublic(user);
    const token = await this.sign(pub);
    return { token, user: pub };
  }

  private async sign(user: PublicUser): Promise<string> {
    const payload = { sub: user.id, email: user.email };
    return this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'dev-secret',
      expiresIn: '24h',
    });
  }
}
