import { Connection } from 'mongoose';
import { transformToCollectionName } from './transform-to-collection-name';

export function removeFromCollection(
  connection: Connection,
  modelName: string,
  filter: any,
) {
  const collection = connection.collection(
    transformToCollectionName(modelName),
  );
  return collection.deleteMany(filter);
}
