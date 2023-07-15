import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../../src/app.module';
import { userInput } from '../../mocks/user.mock';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { EnvService } from '../../../src/config/env.service';

describe('User module (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: join(__dirname, '../../../.env.test'),
        }),
      ],
    })
      .overrideProvider(EnvService)
      .useValue({
        mongoUri: 'mongodb://localhost:3001/test',
        jwtSecret: 'abracadabra',
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  describe('/ (POST)', () => {
    it('should fail if provide invalid inputs', async () => {
      return request(app.getHttpServer()).post('/user').expect(400);
    });

    it('should fail if email already exists', () => {
      return request(app.getHttpServer()).post('/user').expect(409);
    });

    it('should create a user', async () => {
      const response = await request(app.getHttpServer())
        .post('/user')
        .send(userInput)
        .expect(201);

      expect(response.body).toStrictEqual({});
    });
  });
});
