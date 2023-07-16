import { config } from 'dotenv';

export default async () => {
  config({
    path: process.env.TESTING_IN_DOCKER ? '.env.test-docker' : '.env.test',
  });
};
