import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiOperation, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

class AuthResponseDto {
  token!: string;
  user!: { id: string; email: string; name?: string; createdAt: Date };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user and return a JWT' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiBadRequestResponse({ description: 'Email already registered or invalid payload' })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password, dto.name);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Get('me')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Get the current user profile (requires JWT)' })
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any) {
    return { user: req.user };
  }
}
