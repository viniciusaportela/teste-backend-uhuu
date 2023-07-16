import { taskMock, toRawOutput } from './task.mock';

export const taskRepositoryMock = {
  create: jest.fn().mockResolvedValue(toRawOutput(taskMock)),
  update: jest.fn().mockResolvedValue(toRawOutput(taskMock)),
  delete: jest.fn().mockResolvedValue(toRawOutput(taskMock)),
  deleteAllFromUser: jest.fn().mockResolvedValue({
    acknowledged: true,
    deletedCount: 1,
  }),
  findById: jest.fn().mockResolvedValue(toRawOutput(taskMock)),
  findAllFromUser: jest.fn().mockResolvedValue([toRawOutput(taskMock)]),
};
