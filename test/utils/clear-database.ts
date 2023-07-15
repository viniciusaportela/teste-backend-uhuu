import { Connection } from 'mongoose';
import { User } from '../../src/users/user.schema';
import { Task } from '../../src/tasks/task.schema';
import { transformToCollectionName } from './transform-to-collection-name';

export async function clearDatabase(connection: Connection) {
  const promises = [
    connection.collection(transformToCollectionName(User.name)).deleteMany({}),
    connection.collection(transformToCollectionName(Task.name)).deleteMany({}),
  ];

  await Promise.all(promises);
}
