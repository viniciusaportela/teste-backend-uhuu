import { authRawOutput, toRawOutput, userMock } from './user.mock';

export const userServiceMock = {
  create: jest.fn().mockResolvedValue(toRawOutput(userMock)),
  auth: jest.fn().mockResolvedValue(authRawOutput),
  update: jest.fn().mockResolvedValue(toRawOutput(userMock)),
  delete: jest.fn().mockResolvedValue(toRawOutput(userMock)),
  findById: jest.fn().mockResolvedValue(toRawOutput(userMock)),
};
