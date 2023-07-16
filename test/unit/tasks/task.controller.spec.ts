import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TaskController } from '../../../src/tasks/task.controller';
import { TaskService } from '../../../src/tasks/task.service';
import {
  createTaskDtoMock,
  updateTaskDtoMock,
  taskMock,
  findAllTasksFromUserDtoMock,
  taskServiceMock,
} from '../../mocks/task.mock';

// DEV edit

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
    taskServiceMock.findAllFromUser.mockClear();
    taskServiceMock.findById.mockClear();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const response = await controller.create(
        taskMock.createdBy.toString(),
        createTaskDtoMock,
      );

      expect(response).toStrictEqual(taskMock);
      expect(taskServiceMock.create).toBeCalledTimes(1);
      expect(taskServiceMock.create).toBeCalledWith(createTaskDtoMock);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const response = await controller.update(
        taskMock._id.toString(),
        taskMock.createdBy.toString(),
        updateTaskDtoMock,
      );

      expect(response).toStrictEqual(taskMock);
      expect(taskServiceMock.update).toBeCalledTimes(1);
      expect(taskServiceMock.update).toBeCalledWith(
        { id: taskMock._id.toString(), userId: taskMock.createdBy.toString() },
        updateTaskDtoMock,
      );
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      const response = await controller.delete(
        taskMock._id.toString(),
        taskMock.createdBy.toString(),
      );

      expect(response).toStrictEqual(taskMock);
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
        findAllTasksFromUserDtoMock,
      );

      expect(response).toStrictEqual([taskMock]);
      expect(taskServiceMock.findAllFromUser).toBeCalledTimes(1);
      expect(taskServiceMock.findAllFromUser).toBeCalledWith(
        taskMock.createdBy.toString(),
        findAllTasksFromUserDtoMock,
      );
    });
  });

  describe('findById', () => {
    it('should find a task by id', async () => {
      const response = await controller.findById(
        taskMock._id.toString(),
        taskMock.createdBy.toString(),
      );

      expect(response).toStrictEqual(taskMock);
      expect(taskServiceMock.findById).toBeCalledTimes(1);
      expect(taskServiceMock.findById).toBeCalledWith({
        id: taskMock._id.toString(),
        userId: taskMock.createdBy.toString(),
      });
    });
  });
});
