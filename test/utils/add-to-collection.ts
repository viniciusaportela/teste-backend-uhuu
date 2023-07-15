import { Connection } from 'mongoose';
import { transformToCollectionName } from './transform-to-collection-name';

export function addToCollection(
  connection: Connection,
  modelName: string,
  datas: any[],
) {
  const collection = connection.collection(
    transformToCollectionName(modelName),
  );
  return collection.insertMany(datas);
}
