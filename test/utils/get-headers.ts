import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from '../../src/config/env.service';
import { getLastInserted } from './get-last-inserted';
import { getConnectionToken } from '@nestjs/mongoose';
import { User } from '../../src/users/user.schema';

export async function getTestHeaders(app: INestApplication) {
  const jwtService = app.get(JwtService);
  const envService = app.get(EnvService);
  const user = await getLastInserted(app.get(getConnectionToken()), User.name);

  return {
    Authorization: `Bearer ${jwtService.sign(
      { sub: user?._id.toString() },
      { secret: envService.jwtSecret },
    )}`,
  };
}
