import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../guards/jwt.strategy';
import { TaskModule } from '../tasks/task.module';
import { EnvService } from '../config/env.service';
import { EnvModule } from '../config/env.module';

@Module({
  imports: [
    EnvModule,
    JwtModule.registerAsync({
      useFactory: async (envService: EnvService) => ({
        secret: envService.jwtSecret,
        signOptions: { expiresIn: '1h' },
      }),
      imports: [EnvModule],
      inject: [EnvService],
    }),
    TaskModule,
    MongooseModule.forFeature([{ schema: UserSchema, name: User.name }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtStrategy],
})
export class UserModule {}
