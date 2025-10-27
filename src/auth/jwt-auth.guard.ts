import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService, private readonly users: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.headers['authorization'] || '';
    const token = this.extractBearer(auth);
    if (!token) throw new UnauthorizedException('missing bearer token');
    try {
      const payload = await this.jwt.verifyAsync(token, { secret: process.env.JWT_SECRET || 'dev-secret' });
      const user = await this.users.findById(payload.sub);
      if (!user) throw new UnauthorizedException('user not found');
      (req as any).user = this.users.toPublic(user);
      return true;
    } catch (e) {
      throw new UnauthorizedException('invalid token');
    }
  }

  private extractBearer(header: string): string | null {
    const [scheme, value] = header.split(' ');
    if (!scheme || !value) return null;
    if (scheme.toLowerCase() !== 'bearer') return null;
    return value;
  }
}
