import {
  toRawOutput,
  toRawUpdateOutput,
  userMock,
  userUpdateInput,
} from './user.mock';

export const userRepositoryMock = {
  create: jest.fn().mockResolvedValue(toRawOutput(userMock)),
  update: jest
    .fn()
    .mockResolvedValue(toRawUpdateOutput(userMock, userUpdateInput)),
  delete: jest.fn().mockResolvedValue(toRawOutput(userMock)),
  findById: jest.fn().mockResolvedValue(toRawOutput(userMock)),
  findByEmailWithPassword: jest.fn().mockResolvedValue({
    ...toRawOutput(userMock),
    password: userMock.password,
  }),
};
