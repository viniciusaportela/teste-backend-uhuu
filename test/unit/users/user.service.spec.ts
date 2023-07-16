import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  INestApplication,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../../src/users/user.service';
import {
  authInput,
  authRawOutput,
  authWrongInput,
  toInput,
  toRawOutput,
  toRawUpdateOutput,
  userMock,
  userUpdateInput,
} from '../../mocks/users/user.mock';
import { UserRepository } from '../../../src/users/user.repository';
import { userRepositoryMock } from '../../mocks/users/user-repository.mock';
import { JwtService } from '@nestjs/jwt';
import { jwtServiceMock } from '../../mocks/jwt-service.mock';
import { TaskService } from '../../../src/tasks/task.service';
import { taskServiceMock } from '../../mocks/tasks/task-service.mock';

describe('User Service', () => {
  let app: INestApplication;
  let service: UserService;

  beforeEach(async () => {
    const appFixture: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserRepository, JwtService, TaskService],
    })
      .overrideProvider(UserRepository)
      .useValue(userRepositoryMock)
      .overrideProvider(JwtService)
      .useValue(jwtServiceMock)
      .overrideProvider(TaskService)
      .useValue(taskServiceMock)
      .compile();

    app = appFixture.createNestApplication();

    service = appFixture.get<UserService>(UserService);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
    userRepositoryMock.create.mockClear();
    userRepositoryMock.update.mockClear();
    userRepositoryMock.delete.mockClear();
    userRepositoryMock.findById.mockClear();
    userRepositoryMock.findByEmailWithPassword.mockClear();
  });

  describe('create', () => {
    it('should fail if user already exists', async () => {
      const promise = service.create(toInput(userMock));
      await expect(promise).rejects.toThrowError(ConflictException);
      expect(userRepositoryMock.findByEmailWithPassword).toBeCalledTimes(1);
    });

    it('should create a user', async () => {
      userRepositoryMock.findByEmailWithPassword.mockResolvedValueOnce(null);

      const userInput = toInput(userMock);
      const response = await service.create(userInput);

      expect(response).toStrictEqual(toRawOutput(userMock));
      expect(userRepositoryMock.create).toBeCalledTimes(1);
      expect(userRepositoryMock.create).toBeCalledWith({
        ...userInput,
        password: expect.not.stringMatching(userInput.password),
      });
    });
  });

  describe('auth', () => {
    it('should fail if user does not exists', async () => {
      userRepositoryMock.findByEmailWithPassword.mockResolvedValueOnce(null);

      const promise = service.auth(authInput);

      await expect(promise).rejects.toThrowError(UnauthorizedException);
      expect(userRepositoryMock.findByEmailWithPassword).toBeCalledTimes(1);
    });

    it('should fail if given credentials are incorrect', async () => {
      const promise = service.auth(authWrongInput);

      await expect(promise).rejects.toThrowError(UnauthorizedException);
      expect(userRepositoryMock.findByEmailWithPassword).toBeCalledTimes(1);
    });

    it('should authenticate and return token', async () => {
      const response = await service.auth(authInput);

      expect(response).toStrictEqual(authRawOutput);
      expect(userRepositoryMock.findByEmailWithPassword).toBeCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should fail if user does not exists', async () => {
      userRepositoryMock.update.mockResolvedValueOnce(null);

      const promise = service.update(userMock._id.toString(), userUpdateInput);

      await expect(promise).rejects.toThrowError(NotFoundException);
      expect(userRepositoryMock.update).toBeCalledTimes(1);
    });

    it('should update a user', async () => {
      const response = await service.update(userMock._id.toString(), userMock);

      expect(response).toStrictEqual(
        toRawUpdateOutput(userMock, userUpdateInput),
      );
      expect(userRepositoryMock.update).toBeCalledTimes(1);
      expect(userRepositoryMock.update).toBeCalledWith(
        userMock._id.toString(),
        userMock,
      );
    });
  });

  describe('delete', () => {
    it('should fail if user does not exists', async () => {
      userRepositoryMock.delete.mockResolvedValueOnce(null);

      const promise = service.delete(userMock._id.toString());

      await expect(promise).rejects.toThrowError(NotFoundException);
      expect(userRepositoryMock.delete).toBeCalledTimes(1);
    });

    it('should delete a user', async () => {
      const response = await service.delete(userMock._id.toString());

      expect(response).toStrictEqual(toRawOutput(userMock));
      expect(userRepositoryMock.delete).toBeCalledTimes(1);
      expect(userRepositoryMock.delete).toBeCalledWith(userMock._id.toString());
    });
  });

  describe('findById', () => {
    it('should fail if user does not exists', async () => {
      userRepositoryMock.findById.mockResolvedValueOnce(null);

      const promise = service.findById(userMock._id.toString());

      await expect(promise).rejects.toThrowError(NotFoundException);
      expect(userRepositoryMock.findById).toBeCalledTimes(1);
    });

    it('should find a user', async () => {
      const response = await service.findById(userMock._id.toString());

      expect(response).toStrictEqual(toRawOutput(userMock));
      expect(userRepositoryMock.findById).toBeCalledTimes(1);
    });
  });
});
