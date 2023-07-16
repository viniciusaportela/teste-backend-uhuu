import omit from 'lodash.omit';
import { TaskStatus } from '../../src/tasks/enums/task-status.enum';
import { userMockWithId } from './user.mock';
import { Types } from 'mongoose';

export const taskMock = {
  _id: new Types.ObjectId('64b308c0a520e426fdea1fea'),
  title: 'Teste',
  description: 'Teste',
  conclusionDate: new Date('2023-01-01T00:00:00.000Z'),
  status: TaskStatus.Open,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: userMockWithId._id,
};

export const taskMock2 = {
  _id: new Types.ObjectId('64b308c71681df3dd1c4b53e'),
  title: 'Teste 2',
  description: 'Teste 2',
  conclusionDate: new Date('2023-01-02T00:00:00.000Z'),
  status: TaskStatus.Open,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: userMockWithId._id,
};

export const wrongTaskInput = {
  title: false,
  description: false,
  conclusionDate: 'wrong',
  status: 'wrong',
};

export const taskInput = {
  ...omit(taskMock, 'createdAt', 'updatedAt'),
  conclusionDate: taskMock.conclusionDate.toISOString(),
};

export const taskUpdateInput = {
  title: 'Teste 2',
  description: 'Teste 2',
  conclusionDate: new Date('2023-01-02T00:00:00.000Z').toISOString(),
  status: TaskStatus.Done,
};

export function toOutput(input: any) {
  return {
    ...input,
    _id: expect.any(String),
    conclusionDate:
      typeof input.conclusionDate === 'string'
        ? input.conclusionDate
        : input.conclusionDate.toISOString(),
    createdAt: expect.any(String),
    createdBy: input.createdBy.toString(),
    updatedAt: expect.any(String),
  };
}

export const taskUpdateOutput = {
  ...toOutput(taskInput),
  ...taskUpdateInput,
};

export const wrongTaskUpdateInput = {
  ...wrongTaskInput,
};
