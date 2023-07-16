import { authRawOutput } from './user.mock';

export const jwtServiceMock = {
  sign: jest.fn().mockImplementation(() => authRawOutput.token),
};
