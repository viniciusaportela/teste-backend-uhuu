import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../../src/app.module';
import { userMock } from '../../mocks/user.mock';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { clearDatabase } from '../../utils/clear-database';
import { User } from '../../../src/users/user.schema';
import { addToCollection } from '../../utils/add-to-collection';
import { getTestHeaders } from '../../utils/get-headers';
import { removeFromCollection } from '../../utils/remove-from-collection';
import { ErrorMessage } from '../../../src/utils/enums/error-message.enum';
import { getLastInserted } from '../../utils/get-last-inserted';

describe('App module (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeEach(async () => {
    const appFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = appFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    connection = app.get(getConnectionToken());

    await app.init();
  });

  afterEach(async () => {
    await clearDatabase(connection);
    await app.close();
  });

  describe('Jwt Guard', () => {
    it('should fail if not provide token in an private route', async () => {
      const response = await request(app.getHttpServer()).get(`/user/me`);

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe(ErrorMessage.Unauthorized);
    });

    it("should fail if the user doesn't exists anymore", async () => {
      await addToCollection(connection, User.name, [userMock]);

      const headers = await getTestHeaders(app);

      await removeFromCollection(connection, User.name, {
        email: userMock.email,
      });

      const response = await request(app.getHttpServer())
        .get('/user/me')
        .set(headers);

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe(ErrorMessage.UnknownUser);
    });
  });
});
