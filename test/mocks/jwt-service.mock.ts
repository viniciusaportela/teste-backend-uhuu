import { authRawOutput } from './users/user.mock';

export const jwtServiceMock = {
  sign: jest.fn().mockImplementation(() => authRawOutput.token),
};
