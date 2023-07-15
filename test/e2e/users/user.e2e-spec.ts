import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../../src/app.module';
import { userInput } from '../../mocks/user.mock';

describe('User module (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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
