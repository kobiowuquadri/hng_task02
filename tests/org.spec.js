import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app, server } from '../index.js';
import { db } from '../src/config/db.js';
import { User } from '../src/models/auth-model.js';
import { organisation } from '../src/models/org-model.js';

describe('Organization Tests', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await db.delete(organisation).execute();
    await db.delete(User).execute();

    const userData = {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alicesmith@example.com',
      password: 'password456',
      phone: '9876543210'
    };

    const res = await request(app)
      .post('/auth/register')
      .send(userData);

    token = res.body.data.accessToken;
    userId = res.body.data.user.userId;
  });

  afterAll(async () => {
    await db.delete(organisation).execute();
    await db.delete(User).execute();
    server.close();
  });

  describe('GET /api/organisations', () => {
    it('Should Fail if User Tries to Access Organisations they don’t belong to', async () => {
      const anotherUser = {
        firstName: 'Bob',
        lastName: 'Brown',
        email: 'bobbrown@example.com',
        password: 'password123',
        phone: '9876543211'
      };

      await request(app)
        .post('/auth/register')
        .send(anotherUser);

      const res = await request(app)
        .get('/api/organisations')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.organisations).toHaveLength(1);
    });
  });
});
