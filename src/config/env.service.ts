import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService) {}

  get mongoUri(): string {
    return this.configService.get('MONGO_URI');
  }

  get jwtSecret(): string {
    return this.configService.get('JWT_SECRET');
  }
}
