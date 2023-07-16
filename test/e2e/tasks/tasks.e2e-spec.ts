import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../../src/app.module';
import {
  taskMock,
  taskMock2,
  taskUpdateInput,
  toInput,
  toOutput,
  toUpdateOutput,
  wrongTaskInput,
  wrongTaskUpdateInput,
} from '../../mocks/tasks/task.mock';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { clearDatabase } from '../../utils/clear-database';
import { Task } from '../../../src/tasks/task.schema';
import { addToCollection } from '../../utils/add-to-collection';
import { getTestHeaders } from '../../utils/get-headers';
import { getLastInserted } from '../../utils/get-last-inserted';
import { User } from '../../../src/users/user.schema';
import { genMongoId } from '../../utils/gen-mongo-id';
import { ErrorMessage } from '../../../src/utils/enums/error-message.enum';
import { userMock } from '../../mocks/users/user.mock';
import { TaskStatus } from '../../../src/tasks/enums/task-status.enum';

describe('Task module (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeEach(async () => {
    const appFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = appFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    connection = app.get(getConnectionToken());
    await addToCollection(connection, User.name, [userMock]);

    await app.init();
  });

  afterEach(async () => {
    await clearDatabase(connection);
    await app.close();
  });

  describe('/ (POST)', () => {
    it('should fail if is not authenticated', async () => {
      return request(app.getHttpServer())
        .put(`/task/${genMongoId()}`)
        .expect(401);
    });

    it('should fail if provide invalid inputs', async () => {
      return request(app.getHttpServer())
        .post('/task')
        .set(await getTestHeaders(app))
        .send(wrongTaskInput)
        .expect(400);
    });

    it('should create a task', async () => {
      const taskInput = toInput(taskMock);

      const response = await request(app.getHttpServer())
        .post('/task')
        .send(taskInput)
        .set(await getTestHeaders(app))
        .expect(201);

      expect(response.body).toStrictEqual(toOutput(taskMock));
    });
  });

  describe('/:id (PUT)', () => {
    it('should fail if is not authenticated', async () => {
      return request(app.getHttpServer())
        .put(`/task/${genMongoId()}`)
        .expect(401);
    });

    it('should fail if provide invalid inputs', async () => {
      return request(app.getHttpServer())
        .put(`/task/${genMongoId()}`)
        .set(await getTestHeaders(app))
        .send(wrongTaskUpdateInput)
        .expect(400);
    });

    it("should fail if task doesn't exists", async () => {
      return request(app.getHttpServer())
        .put(`/task/${genMongoId()}`)
        .set(await getTestHeaders(app))
        .send(taskUpdateInput)
        .expect(404);
    });

    it('should update your own task', async () => {
      const taskUpdateOutput = toUpdateOutput(taskMock, taskUpdateInput);
      await addToCollection(connection, Task.name, [taskMock]);

      const task = await getLastInserted(connection, Task.name);

      const response = await request(app.getHttpServer())
        .put(`/task/${task._id}`)
        .set(await getTestHeaders(app))
        .send(taskUpdateInput);

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(taskUpdateOutput);
    });
  });

  describe('/:id (DELETE)', () => {
    it('should fail if is not authenticated', async () => {
      return request(app.getHttpServer())
        .delete(`/task/${genMongoId()}`)
        .expect(401);
    });

    it('should fail if try to delete task of another user', async () => {
      await addToCollection(connection, Task.name, [
        { ...taskMock, createdBy: genMongoId() },
      ]);

      const task = await getLastInserted(connection, Task.name);

      const response = await request(app.getHttpServer())
        .delete(`/task/${task._id}`)
        .set(await getTestHeaders(app));

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe(ErrorMessage.NotHavePermission);
    });

    it('should delete the task', async () => {
      await addToCollection(connection, Task.name, [taskMock]);

      const task = await getLastInserted(connection, Task.name);

      const response = await request(app.getHttpServer())
        .delete(`/task/${task._id}`)
        .set(await getTestHeaders(app));

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(toOutput(taskMock));

      const taskAfterDelete = await getLastInserted(connection, Task.name);
      expect(taskAfterDelete).toBeFalsy();
    });
  });

  describe('/:id (GET)', () => {
    it('should fail if is not authenticated', async () => {
      return request(app.getHttpServer())
        .get(`/task/${genMongoId()}`)
        .expect(401);
    });

    it('should fail if try to get task of another user', async () => {
      await addToCollection(connection, Task.name, [
        { ...taskMock, createdBy: genMongoId() },
      ]);

      const task = await getLastInserted(connection, Task.name);

      const response = await request(app.getHttpServer())
        .get(`/task/${task._id}`)
        .set(await getTestHeaders(app));

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toBe(ErrorMessage.NotHavePermission);
    });

    it('should get the task', async () => {
      await addToCollection(connection, Task.name, [taskMock]);

      const task = await getLastInserted(connection, Task.name);

      const response = await request(app.getHttpServer())
        .get(`/task/${task._id}`)
        .set(await getTestHeaders(app));

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(toOutput(taskMock));
    });
  });

  describe('/me (GET)', () => {
    it('should fail if is not authenticated', async () => {
      return request(app.getHttpServer()).get(`/task/me`).expect(401);
    });

    it('should get all tasks of the requester user', async () => {
      await addToCollection(connection, Task.name, [
        { ...taskMock },
        { ...taskMock2 },
        { ...taskMock, _id: genMongoId(), createdBy: genMongoId() },
      ]);

      const response = await request(app.getHttpServer())
        .get(`/task/me`)
        .set(await getTestHeaders(app));

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body).toStrictEqual([
        toOutput(taskMock),
        toOutput(taskMock2),
      ]);
    });

    it('should get all tasks of the requester user, and filter by status', async () => {
      await addToCollection(connection, Task.name, [
        { ...taskMock },
        { ...taskMock2, status: TaskStatus.Done },
        { ...taskMock, _id: genMongoId(), createdBy: genMongoId() },
      ]);

      const response = await request(app.getHttpServer())
        .get(`/task/me`)
        .query({ status: TaskStatus.Done })
        .set(await getTestHeaders(app));

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body).toStrictEqual([
        toOutput({ ...taskMock2, status: TaskStatus.Done }),
      ]);
    });
  });
});
