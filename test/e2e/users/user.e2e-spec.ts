import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../../src/app.module';
import {
  authInput,
  authWrongInput,
  toOutput,
  userInput,
  userMock,
  userUpdateInput,
  userUpdateOutput,
  wrongUserUpdateInput,
} from '../../mocks/user.mock';
import { Connection, Types } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { clearDatabase } from '../../utils/clear-database';
import { User } from '../../../src/users/user.schema';
import { addToCollection } from '../../utils/add-to-collection';
import { ErrorMessage } from '../../../src/utils/enums/error-message.enum';
import { JwtService } from '@nestjs/jwt';
import { getTestHeaders } from '../../utils/get-headers';
import { removeFromCollection } from '../../utils/remove-from-collection';
import { getLastInserted } from '../../utils/get-last-inserted';
import { taskMock } from '../../mocks/task.mock';
import { Task } from '../../../src/tasks/task.schema';

describe('User module (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    connection = app.get(getConnectionToken());

    await app.init();
  });

  afterEach(async () => {
    await clearDatabase(connection);
    await app.close();
  });

  describe('/ (POST)', () => {
    it('should fail if provide invalid inputs', async () => {
      return request(app.getHttpServer()).post('/user').expect(400);
    });

    it('should fail if email already exists', async () => {
      await addToCollection(connection, User.name, [userMock]);

      return request(app.getHttpServer())
        .post('/user')
        .send(userInput)
        .expect(409);
    });

    it('should create a user', async () => {
      const response = await request(app.getHttpServer())
        .post('/user')
        .send(userInput)
        .expect(201);

      expect(response.body).toStrictEqual(toOutput(userInput));
    });
  });

  describe('/user/auth (POST)', () => {
    it('should fail if provide invalid inputs', async () => {
      await request(app.getHttpServer()).post('/user/auth').expect(400);
    });

    it("should fail if user doesn't exists", async () => {
      const response = await request(app.getHttpServer())
        .post('/user/auth')
        .send(authWrongInput);

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe(ErrorMessage.WrongCredentials);
    });

    it('should fail if provide incorrect credentials', async () => {
      await addToCollection(connection, User.name, [userMock]);

      const response = await request(app.getHttpServer())
        .post('/user/auth')
        .send(authWrongInput);

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe(ErrorMessage.WrongCredentials);
    });

    it('should return a valid token', async () => {
      await addToCollection(connection, User.name, [userMock]);

      const response = await request(app.getHttpServer())
        .post('/user/auth')
        .send(authInput);

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({ token: expect.any(String) });

      const token = response.body.token;
      const decoded = app.get(JwtService).decode(token);
      expect(Types.ObjectId.isValid(decoded.sub)).toBeTruthy();
    });
  });

  describe('/me (PUT)', () => {
    it('should fail if is not authenticated', async () => {
      return request(app.getHttpServer()).put('/user/me').expect(401);
    });

    it('should fail if provide invalid inputs', async () => {
      await addToCollection(connection, User.name, [userMock]);

      return request(app.getHttpServer())
        .put('/user/me')
        .set(await getTestHeaders(app))
        .send(wrongUserUpdateInput)
        .expect(400);
    });

    it('should update your own user', async () => {
      await addToCollection(connection, User.name, [userMock]);

      const response = await request(app.getHttpServer())
        .put('/user/me')
        .set(await getTestHeaders(app))
        .send(userUpdateInput);

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(userUpdateOutput);
    });
  });

  describe('/me (DELETE)', () => {
    it('should fail if is not authenticated', async () => {
      return request(app.getHttpServer()).delete('/user/me').expect(401);
    });

    it('should fail if user was already deleted', async () => {
      await addToCollection(connection, User.name, [userMock]);

      const headers = await getTestHeaders(app);

      await removeFromCollection(connection, User.name, {
        email: userMock.email,
      });

      const response = await request(app.getHttpServer())
        .delete('/user/me')
        .set(headers)
        .send(wrongUserUpdateInput);

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe(ErrorMessage.UnknownUser);
    });

    it("should delete your own user and all it's related tasks", async () => {
      await addToCollection(connection, User.name, [userMock]);
      await addToCollection(connection, Task.name, [taskMock]);

      const response = await request(app.getHttpServer())
        .delete('/user/me')
        .set(await getTestHeaders(app));

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(toOutput(userInput));

      const userAfterDelete = await getLastInserted(connection, User.name);
      expect(userAfterDelete).toBeFalsy();

      // Expect all tasks from the deleted user to also be deleted
      const taskAfterDelete = await getLastInserted(connection, Task.name);
      expect(taskAfterDelete).toBeFalsy();
    });
  });

  describe('/me (GET)', () => {
    it('should fail if is not authenticated', async () => {
      return request(app.getHttpServer()).get('/user/me').expect(401);
    });

    it('should return your own user', async () => {
      await addToCollection(connection, User.name, [userMock]);

      const response = await request(app.getHttpServer())
        .get('/user/me')
        .set(await getTestHeaders(app));

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(toOutput(userInput));
    });
  });
});
