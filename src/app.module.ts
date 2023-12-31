import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './tasks/task.module';
import { EnvService } from './config/env.service';
import { EnvModule } from './config/env.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'test'
          ? process.env.TESTING_IN_DOCKER === 'true'
            ? '.env.test-docker'
            : '.env.test'
          : '.env',
    }),
    EnvModule,
    MongooseModule.forRootAsync({
      useFactory: async (EnvService: EnvService) => {
        return {
          uri: EnvService.mongoUri,
        };
      },
      imports: [EnvModule],
      inject: [EnvService],
    }),
    TaskModule,
    UserModule,
  ],
})
export class AppModule {}
