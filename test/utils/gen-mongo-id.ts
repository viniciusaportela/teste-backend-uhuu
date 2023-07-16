import { Types } from 'mongoose';

export function genMongoId() {
  return new Types.ObjectId().toString();
}
