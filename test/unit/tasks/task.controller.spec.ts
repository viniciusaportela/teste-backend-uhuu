import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TaskController } from '../../../src/tasks/task.controller';
import { TaskService } from '../../../src/tasks/task.service';
import {
  taskMock,
  taskUpdateInput,
  toInput,
} from '../../mocks/tasks/task.mock';
import { taskServiceMock } from '../../mocks/tasks/task-service.mock';
import omit from 'lodash.omit';
import { Task } from '../../../src/tasks/task.schema';
import { TaskStatus } from '../../../src/tasks/enums/task-status.enum';
import { toRawOutput } from '../../mocks/users/user.mock';

describe('Task Controller', () => {
  let app: INestApplication;
  let controller: TaskController;

  beforeEach(async () => {
    const appFixture: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService],
    })
      .overrideProvider(TaskService)
      .useValue(taskServiceMock)
      .compile();

    app = appFixture.createNestApplication();

    controller = appFixture.get<TaskController>(TaskController);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
    taskServiceMock.create.mockClear();
    taskServiceMock.update.mockClear();
    taskServiceMock.delete.mockClear();
    taskServiceMock.deleteAllFromUser.mockClear();
    taskServiceMock.findById.mockClear();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const response = await controller.create(
        taskMock.createdBy.toString(),
        toInput(omit<Task>(taskMock, 'createdBy') as Task),
      );

      expect(response).toStrictEqual(toRawOutput(taskMock));
      expect(taskServiceMock.create).toBeCalledTimes(1);
      expect(taskServiceMock.create).toBeCalledWith(toInput(taskMock));
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const response = await controller.update(
        taskMock._id.toString(),
        taskMock.createdBy.toString(),
        taskUpdateInput,
      );

      expect(response).toStrictEqual(toRawOutput(taskMock));
      expect(taskServiceMock.update).toBeCalledTimes(1);
      expect(taskServiceMock.update).toBeCalledWith(
        { id: taskMock._id.toString(), userId: taskMock.createdBy.toString() },
        taskUpdateInput,
      );
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      const response = await controller.delete(
        taskMock._id.toString(),
        taskMock.createdBy.toString(),
      );

      expect(response).toStrictEqual(toRawOutput(taskMock));
      expect(taskServiceMock.delete).toBeCalledTimes(1);
      expect(taskServiceMock.delete).toBeCalledWith({
        id: taskMock._id.toString(),
        userId: taskMock.createdBy.toString(),
      });
    });
  });

  describe('findAllFromUser', () => {
    it('should find all tasks from a user', async () => {
      const response = await controller.findAllFromUser(
        taskMock.createdBy.toString(),
        { status: TaskStatus.Done },
      );

      expect(response).toStrictEqual([toRawOutput(taskMock)]);
      expect(taskServiceMock.findAllFromUser).toBeCalledTimes(1);
      expect(taskServiceMock.findAllFromUser).toBeCalledWith(
        taskMock.createdBy.toString(),
        { status: TaskStatus.Done },
      );
    });
  });

  describe('findById', () => {
    it('should find a task by id', async () => {
      const response = await controller.findById(
        taskMock._id.toString(),
        taskMock.createdBy.toString(),
      );

      expect(response).toStrictEqual(toRawOutput(taskMock));
      expect(taskServiceMock.findById).toBeCalledTimes(1);
      expect(taskServiceMock.findById).toBeCalledWith({
        id: taskMock._id.toString(),
        userId: taskMock.createdBy.toString(),
      });
    });
  });
});
