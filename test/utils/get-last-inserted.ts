import { Connection } from 'mongoose';
import { transformToCollectionName } from './transform-to-collection-name';

export function getLastInserted(connection: Connection, modelName: string) {
  const collection = connection.collection(
    transformToCollectionName(modelName),
  );
  return collection.findOne({}, { sort: { _id: -1 } });
}
