import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UserController } from '../../../src/users/user.controller';
import { UserService } from '../../../src/users/user.service';
import {
  authInput,
  authRawOutput,
  toInput,
  toRawOutput,
  toRawUpdateOutput,
  userMock,
  userUpdateInput,
} from '../../mocks/user.mock';
import { userServiceMock } from '../../mocks/user-service.mock';

describe('User Controller', () => {
  let app: INestApplication;
  let controller: UserController;

  beforeEach(async () => {
    const appFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(userServiceMock)
      .compile();

    app = appFixture.createNestApplication();

    controller = appFixture.get<UserController>(UserController);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
    userServiceMock.create.mockClear();
    userServiceMock.auth.mockClear();
    userServiceMock.update.mockClear();
    userServiceMock.delete.mockClear();
    userServiceMock.findById.mockClear();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const userInput = toInput(userMock);
      const response = await controller.create(userInput);

      expect(response).toStrictEqual(toRawOutput(userMock));
      expect(userServiceMock.create).toBeCalledTimes(1);
      expect(userServiceMock.create).toBeCalledWith(userInput);
    });
  });

  describe('auth', () => {
    it('should authenticate a user and return a token', async () => {
      const response = await controller.auth(authInput);

      expect(response).toStrictEqual(authRawOutput);
      expect(userServiceMock.auth).toBeCalledTimes(1);
      expect(userServiceMock.auth).toBeCalledWith(authInput);
    });
  });

  describe('updateMe', () => {
    it('should update a user', async () => {
      const response = await controller.updateMe(
        userMock._id.toString(),
        userUpdateInput,
      );

      expect(response).toStrictEqual(
        toRawUpdateOutput(userMock, userUpdateInput),
      );
      expect(userServiceMock.update).toBeCalledTimes(1);
      expect(userServiceMock.update).toBeCalledWith(
        userMock._id.toString(),
        userUpdateInput,
      );
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const response = await controller.deleteMe(userMock._id.toString());

      expect(response).toStrictEqual(toRawOutput(userMock));
      expect(userServiceMock.delete).toBeCalledTimes(1);
      expect(userServiceMock.delete).toBeCalledWith(userMock._id.toString());
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const response = await controller.getMe(userMock._id.toString());

      expect(response).toStrictEqual(toRawOutput(userMock));
      expect(userServiceMock.findById).toBeCalledTimes(1);
      expect(userServiceMock.findById).toBeCalledWith(userMock._id.toString());
    });
  });
});
