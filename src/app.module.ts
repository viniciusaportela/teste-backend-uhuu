import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TaskModule } from './tasks/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async (ConfigService: ConfigService) => {
        return {
          uri: ConfigService.get('MONGO_URI'),
        };
      },
      inject: [ConfigService],
    }),
    TaskModule,
    UserModule,
  ],
})
export class AppModule {}
