import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';

class HealthDto {
  status!: string;
}

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiOkResponse({ type: HealthDto })
  getHealth(): HealthDto {
    return { status: 'ok' };
  }
}
