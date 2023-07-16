import omit from 'lodash.omit';
import { hashPasswordSync } from '../../src/utils/hash-password';
import { Types } from 'mongoose';
import { sign } from 'jsonwebtoken';
import { User } from '../../src/users/user.schema';
import { CreateUserDto } from '../../src/users/dtos/create-user.dto';
import { UpdateUserDto } from '../../src/users/dtos/update-user.dto';

export const userMock = {
  _id: new Types.ObjectId('64b303431d9b59b567fac3a0'),
  name: 'Teste',
  email: 'test@gmail.com',
  password: hashPasswordSync('1234'),
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
};

export const userUpdateInput = {
  name: 'Teste 2',
  password: '12345',
};

export const wrongUserUpdateInput = {
  name: 123,
  password: false,
};

export const authInput = {
  email: userMock.email,
  password: toInput(userMock).password,
};

export const authWrongInput = {
  email: userMock.email,
  password: 'wrong',
};

export const authRawOutput = {
  token: sign({ sub: userMock._id.toString() }, process.env.JWT_SECRET),
};

export function toInput(mock: User) {
  return {
    ...omit(mock, 'createdAt', 'updatedAt', '_id', '__v'),
    password: '1234',
  };
}

export function toOutput(input: CreateUserDto | User) {
  return {
    ...omit(input, 'password', '__v'),
    _id: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  };
}

export function toUpdateOutput(
  originalInput: User,
  updateInput: UpdateUserDto,
) {
  return {
    ...toOutput(originalInput),
    ...omit(updateInput, 'password'),
  };
}

export function toRawOutput(input: any) {
  return {
    ...omit(input, 'password', '__v'),
  };
}
