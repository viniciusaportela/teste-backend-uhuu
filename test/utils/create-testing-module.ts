import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';

export async function createTestingModule() {
  const appFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const testApp = appFixture.createNestApplication();
  testApp.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  const testConnection = testApp.get(getConnectionToken());

  return { testConnection, testApp };
}
