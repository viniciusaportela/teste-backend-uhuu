import { hash, hashSync } from 'bcrypt';

export function hashPassword(password: string) {
  return hash(password, 10);
}

export function hashPasswordSync(password: string) {
  return hashSync(password, 10);
}
