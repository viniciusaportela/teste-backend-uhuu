import {
  authRawOutput,
  toRawOutput,
  toRawUpdateOutput,
  userMock,
  userUpdateInput,
} from './user.mock';

export const userServiceMock = {
  create: jest.fn().mockResolvedValue(toRawOutput(userMock)),
  auth: jest.fn().mockResolvedValue(authRawOutput),
  update: jest
    .fn()
    .mockResolvedValue(toRawUpdateOutput(userMock, userUpdateInput)),
  delete: jest.fn().mockResolvedValue(toRawOutput(userMock)),
  findById: jest.fn().mockResolvedValue(toRawOutput(userMock)),
};
