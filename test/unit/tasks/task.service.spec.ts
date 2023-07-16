import { Test, TestingModule } from '@nestjs/testing';
import {
  ForbiddenException,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { TaskService } from '../../../src/tasks/task.service';
import {
  taskMock,
  taskCreateDto,
  taskUpdateDto,
  identityMock,
  listTasksFromUserDto,
  taskRepositoryMock,
} from '../../mocks/task.mock';
import { TaskRepository } from '../../../src/tasks/task.repository';

// DEV

describe('Task Service', () => {
  let app: INestApplication;
  let service: TaskService;

  beforeEach(async () => {
    const appFixture: TestingModule = await Test.createTestingModule({
      providers: [TaskService, TaskRepository],
    })
      .overrideProvider(TaskRepository)
      .useValue(taskRepositoryMock)
      .compile();

    app = appFixture.createNestApplication();

    service = appFixture.get<TaskService>(TaskService);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
    taskRepositoryMock.create.mockClear();
    taskRepositoryMock.update.mockClear();
    taskRepositoryMock.delete.mockClear();
    taskRepositoryMock.deleteAllFromUser.mockClear();
    taskRepositoryMock.findAllFromUser.mockClear();
    taskRepositoryMock.findById.mockClear();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const response = await service.create(taskCreateDto);
      expect(response).toStrictEqual(taskMock);
      expect(taskRepositoryMock.create).toBeCalledTimes(1);
      expect(taskRepositoryMock.create).toBeCalledWith(taskCreateDto);
    });
  });

  describe('update', () => {
    it('should fail if task does not exists or no permission', async () => {
      taskRepositoryMock.findById.mockResolvedValueOnce(null);

      const promise = service.update(identityMock, taskUpdateDto);
      await expect(promise).rejects.toThrowError(NotFoundException);
      expect(taskRepositoryMock.findById).toBeCalledTimes(1);
    });

    it('should update a task', async () => {
      const response = await service.update(identityMock, taskUpdateDto);
      expect(response).toStrictEqual(taskMock);
      expect(taskRepositoryMock.update).toBeCalledTimes(1);
      expect(taskRepositoryMock.update).toBeCalledWith(
        identityMock.id,
        taskUpdateDto,
      );
    });
  });

  describe('delete', () => {
    it('should fail if task does not exists or no permission', async () => {
      taskRepositoryMock.findById.mockResolvedValueOnce(null);

      const promise = service.delete(identityMock);
      await expect(promise).rejects.toThrowError(NotFoundException);
      expect(taskRepositoryMock.findById).toBeCalledTimes(1);
    });

    it('should delete a task', async () => {
      const response = await service.delete(identityMock);
      expect(response).toStrictEqual(taskMock);
      expect(taskRepositoryMock.delete).toBeCalledTimes(1);
      expect(taskRepositoryMock.delete).toBeCalledWith(identityMock.id);
    });
  });

  describe('deleteAllFromUser', () => {
    it('should delete all tasks from a user', async () => {
      const response = await service.deleteAllFromUser(identityMock.userId);
      expect(response).toStrictEqual([]);
      expect(taskRepositoryMock.deleteAllFromUser).toBeCalledTimes(1);
      expect(taskRepositoryMock.deleteAllFromUser).toBeCalledWith(
        identityMock.userId,
      );
    });
  });

  describe('findAllFromUser', () => {
    it('should find all tasks from a user', async () => {
      const response = await service.findAllFromUser(
        identityMock.userId,
        listTasksFromUserDto,
      );
      expect(response).toStrictEqual([taskMock]);
      expect(taskRepositoryMock.findAllFromUser).toBeCalledTimes(1);
      expect(taskRepositoryMock.findAllFromUser).toBeCalledWith(
        identityMock.userId,
        listTasksFromUserDto,
      );
    });
  });

  describe('findById', () => {
    it('should fail if task does not exists or no permission', async () => {
      taskRepositoryMock.findById.mockResolvedValueOnce(null);

      const promise = service.findById(identityMock);
      await expect(promise).rejects.toThrowError(NotFoundException);
      expect(taskRepositoryMock.findById).toBeCalledTimes(1);
    });

    it('should find a task', async () => {
      const response = await service.findById(identityMock);
      expect(response).toStrictEqual(taskMock);
      expect(taskRepositoryMock.findById).toBeCalledTimes(1);
    });
  });
});
