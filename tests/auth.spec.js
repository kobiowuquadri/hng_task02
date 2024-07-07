import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../index.js';
import { db } from '../src/config/db.js';
import { User } from '../src/models/auth-model.js';
import { organisation } from '../src/models/org-model.js';


describe('Authentication Tests', () => {
  // Before and after hooks
  beforeAll(async () => {
    await db.delete(organisation).execute();
    await db.delete(User).execute();
  });

  afterAll(async () => {
    await db.delete(organisation).execute();
    await db.delete(User).execute();
    app.close(); // Ensure the server is closed after tests
  });

  describe('POST /auth/register', () => {
    it('Should Register User Successfully with Default Organisation', async () => {
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

      expect(res.statusCode).toBe(201); // Using toBe for statusCode comparison
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('message', 'Registration successful');
      expect(res.body.data.user.firstName).toEqual(userData.firstName);
      expect(res.body.data.user.lastName).toEqual(userData.lastName);
      expect(res.body.data.user.email).toEqual(userData.email);
      expect(res.body.data).toHaveProperty('accessToken');

      const decoded = jwt.verify(res.body.data.accessToken, process.env.JWT_SECRET);
      expect(decoded.userId).toEqual(res.body.data.user.userId);
    });

    it('Should Log the user in successfully', async () => {
      const userData = {
        email: 'alicesmith@example.com',
        password: 'password456'
      };

      const res = await request(app)
        .post('/auth/login')
        .send(userData);

      expect(res.statusCode).toBe(200); // Using toBe for statusCode comparison
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('message', 'Login successful');
      expect(res.body.data.user.email).toEqual(userData.email);
      expect(res.body.data).toHaveProperty('accessToken');

      const decoded = jwt.verify(res.body.data.accessToken, process.env.JWT_SECRET);
      expect(decoded.userId).toEqual(res.body.data.user.userId);
    });

    it('Should Fail If Required Fields Are Missing', async () => {
      const userData = {
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        phone: '1234567890'
      };

      const res = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(res.statusCode).toBe(422); // Using toBe for statusCode comparison
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors).toHaveLength(1);
      expect(res.body.errors[0]).toHaveProperty('field', 'firstName');
      expect(res.body.errors[0]).toHaveProperty('message', 'Please provide your firstname');
    });

    it('Should Fail if there’s Duplicate Email', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        phone: '1234567890'
      };

      await request(app)
        .post('/auth/register')
        .send(userData);

      const res = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(res.statusCode).toBe(422); // Using toBe for statusCode comparison
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors).toHaveLength(1);
      expect(res.body.errors[0]).toHaveProperty('field', 'email');
      expect(res.body.errors[0]).toHaveProperty('message', 'User with this email already exists');
    });
  });
});
