import { Test, TestingModule } from '@nestjs/testing';
import {
  ForbiddenException,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { TaskService } from '../../../src/tasks/task.service';
import {
  taskMock,
  taskUpdateInput,
  toInput,
  toRawOutput,
} from '../../mocks/tasks/task.mock';
import { TaskRepository } from '../../../src/tasks/task.repository';
import { taskRepositoryMock } from '../../mocks/tasks/task-repository.mock';
import { genMongoId } from '../../utils/gen-mongo-id';
import { TaskStatus } from '../../../src/tasks/enums/task-status.enum';

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
      const response = await service.create(toInput(taskMock));

      expect(response).toStrictEqual(toRawOutput(taskMock));
      expect(taskRepositoryMock.create).toBeCalledTimes(1);
      expect(taskRepositoryMock.create).toBeCalledWith(toInput(taskMock));
    });
  });

  describe('update', () => {
    it('should fail if task does not exists', async () => {
      taskRepositoryMock.findById.mockResolvedValueOnce(null);

      const promise = service.update(
        { id: taskMock._id.toString(), userId: taskMock.createdBy.toString() },
        taskUpdateInput,
      );

      await expect(promise).rejects.toThrowError(NotFoundException);
      expect(taskRepositoryMock.findById).toBeCalledTimes(1);
    });

    it("should fail if doesn't own the updated task", async () => {
      taskRepositoryMock.findById.mockResolvedValueOnce({
        ...toRawOutput(taskMock),
        createdBy: genMongoId(),
      });

      const promise = service.update(
        { id: taskMock._id.toString(), userId: taskMock.createdBy.toString() },
        taskUpdateInput,
      );

      await expect(promise).rejects.toThrowError(ForbiddenException);
      expect(taskRepositoryMock.findById).toBeCalledTimes(1);
    });

    it('should update a task', async () => {
      const response = await service.update(
        { id: taskMock._id.toString(), userId: taskMock.createdBy.toString() },
        taskUpdateInput,
      );

      expect(response).toStrictEqual(toRawOutput(taskMock));
      expect(taskRepositoryMock.findById).toBeCalledTimes(1);
      expect(taskRepositoryMock.update).toBeCalledTimes(1);
      expect(taskRepositoryMock.update).toBeCalledWith(
        taskMock._id.toString(),
        taskUpdateInput,
      );
    });
  });

  describe('delete', () => {
    it('should fail if task does not exists', async () => {
      taskRepositoryMock.findById.mockResolvedValueOnce(null);

      const promise = service.delete({
        id: taskMock._id.toString(),
        userId: taskMock.createdBy.toString(),
      });

      await expect(promise).rejects.toThrowError(NotFoundException);
      expect(taskRepositoryMock.findById).toBeCalledTimes(1);
    });

    it("should fail if doesn't own the deleted task", async () => {
      taskRepositoryMock.findById.mockResolvedValueOnce({
        ...toRawOutput(taskMock),
        createdBy: genMongoId(),
      });

      const promise = service.delete({
        id: taskMock._id.toString(),
        userId: taskMock.createdBy.toString(),
      });

      await expect(promise).rejects.toThrowError(ForbiddenException);
      expect(taskRepositoryMock.findById).toBeCalledTimes(1);
    });

    it('should delete a task', async () => {
      const response = await service.delete({
        id: taskMock._id.toString(),
        userId: taskMock.createdBy.toString(),
      });

      expect(response).toStrictEqual(toRawOutput(taskMock));
      expect(taskRepositoryMock.findById).toBeCalledTimes(1);
      expect(taskRepositoryMock.delete).toBeCalledTimes(1);
      expect(taskRepositoryMock.delete).toBeCalledWith(taskMock._id.toString());
    });
  });

  describe('deleteAllFromUser', () => {
    it('should delete all tasks from a user', async () => {
      const response = await service.deleteAllFromUser(
        taskMock.createdBy.toString(),
      );

      expect(response).toStrictEqual({ acknowledged: true, deletedCount: 1 });
      expect(taskRepositoryMock.deleteAllFromUser).toBeCalledTimes(1);
      expect(taskRepositoryMock.deleteAllFromUser).toBeCalledWith(
        taskMock.createdBy.toString(),
      );
    });
  });

  describe('findAllFromUser', () => {
    it('should find all tasks from a user', async () => {
      const response = await service.findAllFromUser(
        taskMock.createdBy.toString(),
        { status: TaskStatus.Done },
      );

      expect(response).toStrictEqual([toRawOutput(taskMock)]);
      expect(taskRepositoryMock.findAllFromUser).toBeCalledTimes(1);
      expect(taskRepositoryMock.findAllFromUser).toBeCalledWith(
        taskMock.createdBy.toString(),
        { status: TaskStatus.Done },
      );
    });
  });

  describe('findById', () => {
    it('should fail if task does not exists', async () => {
      taskRepositoryMock.findById.mockResolvedValueOnce(null);

      const promise = service.findById({
        id: taskMock._id.toString(),
        userId: taskMock.createdBy.toString(),
      });

      await expect(promise).rejects.toThrowError(NotFoundException);
      expect(taskRepositoryMock.findById).toBeCalledTimes(1);
      expect(taskRepositoryMock.findById).toBeCalledWith(
        taskMock._id.toString(),
      );
    });

    it("should fail if doesn't own the found task", async () => {
      taskRepositoryMock.findById.mockResolvedValueOnce({
        ...toRawOutput(taskMock),
        createdBy: genMongoId(),
      });

      const promise = service.findById({
        id: taskMock._id.toString(),
        userId: taskMock.createdBy.toString(),
      });

      await expect(promise).rejects.toThrowError(ForbiddenException);
      expect(taskRepositoryMock.findById).toBeCalledTimes(1);
      expect(taskRepositoryMock.findById).toBeCalledWith(
        taskMock._id.toString(),
      );
    });

    it('should find a task', async () => {
      const response = await service.findById({
        id: taskMock._id.toString(),
        userId: taskMock.createdBy.toString(),
      });

      expect(response).toStrictEqual(toRawOutput(taskMock));
      expect(taskRepositoryMock.findById).toBeCalledTimes(1);
      expect(taskRepositoryMock.findById).toBeCalledWith(
        taskMock._id.toString(),
      );
    });
  });
});
