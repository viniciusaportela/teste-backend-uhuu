import omit from 'lodash.omit';
import { TaskStatus } from '../../../src/tasks/enums/task-status.enum';
import { Types } from 'mongoose';
import { userMock } from '../users/user.mock';
import { CreateTaskDto } from '../../../src/tasks/dtos/create-task.dto';
import { Task } from '../../../src/tasks/task.schema';
import { UpdateTaskDto } from '../../../src/tasks/dtos/update-task.dto';

export const taskMock = {
  _id: new Types.ObjectId('64b308c0a520e426fdea1fea'),
  title: 'Teste',
  description: 'Teste',
  conclusionDate: new Date('2023-01-01T00:00:00.000Z'),
  status: TaskStatus.Open,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: userMock._id,
  __v: 0,
};

export const taskMock2 = {
  _id: new Types.ObjectId('64b308c71681df3dd1c4b53e'),
  title: 'Teste 2',
  description: 'Teste 2',
  conclusionDate: new Date('2023-01-02T00:00:00.000Z'),
  status: TaskStatus.Open,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: userMock._id,
  __v: 0,
};

export const wrongTaskInput = {
  title: false,
  description: false,
  conclusionDate: 'wrong',
  status: 'wrong',
};

export const taskUpdateInput = {
  title: 'Teste 2',
  description: 'Teste 2',
  conclusionDate: new Date('2023-01-02T00:00:00.000Z').toISOString(),
  status: TaskStatus.Done,
};

export const wrongTaskUpdateInput = {
  ...wrongTaskInput,
};

export function toInput(mock: Task) {
  return {
    ...omit(mock, 'createdAt', 'updatedAt', '_id', '__v'),
    conclusionDate: mock.conclusionDate.toISOString(),
  };
}

export function toOutput(input: CreateTaskDto | Task) {
  return {
    ...omit(input, '__v'),
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

export function toRawOutput(mock: Task | CreateTaskDto) {
  return {
    ...omit(mock, '__v'),
  };
}

export function toUpdateOutput(
  originalInput: Task,
  updateInput: UpdateTaskDto,
) {
  return {
    ...toOutput(originalInput),
    ...omit(updateInput, 'password'),
  };
}

export function toRawUpdateOutput(
  originalInput: Task,
  updateInput: UpdateTaskDto,
) {
  return {
    ...toRawOutput(originalInput),
    ...omit(updateInput, 'password'),
  };
}
