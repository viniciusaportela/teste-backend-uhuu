import omit from 'lodash.omit';
import { hashPasswordSync } from '../../src/utils/hash-password';

export const userMock = {
  name: 'Teste',
  email: 'test@gmail.com',
  password: hashPasswordSync('1234'),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const userInput = {
  ...omit(userMock, 'createdAt', 'updatedAt'),
  password: '1234',
};

export const userUpdateInput = {
  name: 'Teste 2',
  password: '12345',
};

export const wrongUserUpdateInput = {
  name: 123,
  password: false,
};

export const userUpdateInputWithEmail = {
  ...userUpdateInput,
  email: 'test2@gmail.com',
};

export const userOutput = {
  ...omit(userMock, 'password'),
  _id: expect.any(String),
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
};

export const authInput = {
  email: userInput.email,
  password: userInput.password,
};

export const authWrongInput = {
  email: 'wrong@gmail.com',
  password: 'wrong',
};
