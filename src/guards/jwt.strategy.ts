import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { ErrorMessage } from '../utils/enums/error-message.enum';
import { EnvService } from '../config/env.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: UserRepository,
    readonly envService: EnvService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envService.jwtSecret,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException(ErrorMessage.UnknownUser);
    }

    return { id: payload.sub };
  }
}
