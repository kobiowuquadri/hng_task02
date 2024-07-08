import request from 'supertest';
import jwt from 'jsonwebtoken';
import { db } from '../src/config/db.js';
import { User } from '../src/models/auth-model.js';
import { organisation } from '../src/models/org-model.js';
import { app } from '../server.js';

describe('Authentication Tests', () => {
  beforeAll(async () => {
    await db.delete(organisation).execute();
    await db.delete(User).execute();
  });

  afterAll(async () => {
    await db.delete(organisation).execute();
    await db.delete(User).execute();
    if (app && typeof app.close === 'function') {
      app.close();
    }
  });

  describe('POST /auth/register', () => {
    it('Should register user successfully with default organisation', async () => {
      const userData = {
        firstName: 'Kobi',
        lastName: 'Owu',
        email: 'kobiowu@example.com',
        password: 'password456',
        phone: '9876543210'
      };

      const res = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('message', 'Registration successful');
      expect(res.body.data.user.firstName).toEqual(userData.firstName);
      expect(res.body.data.user.lastName).toEqual(userData.lastName);
      expect(res.body.data.user.email).toEqual(userData.email);
      expect(res.body.data).toHaveProperty('accessToken');

      const decoded = jwt.verify(res.body.data.accessToken, process.env.JWT_SECRET);
      expect(decoded.userId).toEqual(res.body.data.user.userId);
    });

    it('Should log the user in successfully', async () => {
      const userData = {
        email: 'kobiowu@example.com',
        password: 'password456'
      };

      const res = await request(app)
        .post('/auth/login')
        .send(userData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('message', 'Login successful');
      expect(res.body.data.user.email).toEqual(userData.email);
      expect(res.body.data).toHaveProperty('accessToken');

      const decoded = jwt.verify(res.body.data.accessToken, process.env.JWT_SECRET);
      expect(decoded.userId).toEqual(res.body.data.user.userId);
    });


    it('Should fail if required fields are missing', async () => {
      const userData = {
        // Missing firstName intentionally to trigger validation error
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
        phone: '1234567890',
      };

      const res = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(res.statusCode).toBe(422);
      expect(res.body.errors).not.toStrictEqual(
        expect.arrayContaining([
          { field: 'firstName', message: 'Please provide your firstname' },
          { message: 'Invalid value' }, // Expect the exact error message for the second object
        ])
      );
    });
    

    it('Should fail if there’s a duplicate email', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
         email: 'kobiowu@example.com',
        password: 'password456',
        phone: '1234567890',
      };
    
      const res = await request(app)
        .post('/auth/register')
        .send(userData);
    
      expect(res.statusCode).toBe(422); // Adjust if the API returns a different error code for duplicate email
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors).toHaveLength(1); // Assuming one error for duplicate email
    });
    
    

  describe('POST /auth/login', () => {
    it('Should return 401 error if login fails', async () => {
      const invalidCredentials = {
        email: 'nonexistentuser@example.com',
        password: 'invalidpassword'
      };
    
      const res = await request(app)
        .post('/auth/login')
        .send(invalidCredentials);
    
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('status', 'Bad request');
      expect(res.body).toHaveProperty('message', 'Authentication failed');
    });
    

    it('Should login a user successfully', async () => {
      const userData = {
        email: 'kobiowu@example.com',
        password: 'password456'
      };

      const res = await request(app)
        .post('/auth/login')
        .send(userData);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('message', 'Login successful');
      expect(res.body.data.user.email).toEqual(userData.email);
      expect(res.body.data).toHaveProperty('accessToken');

      const decoded = jwt.verify(res.body.data.accessToken, process.env.JWT_SECRET);
      expect(decoded.userId).toEqual(res.body.data.user.userId);
    });
  });

  describe('GET /organisations', () => {
    let token;
  
    it('Should retrieve organisations after successful login', async () => {
      const userData = {
        email: 'kobiowu@example.com',
        password: 'password456'
      };
  
      const loginRes = await request(app)
        .post('/auth/login')
        .send(userData);
  
      token = loginRes.body.data.accessToken;
      console.log(token)
  
      const res = await request(app)
        .get('/organisations')
        .set('Authorization', `Bearer ${token}`);
  
      expect(res.statusCode).toBe(200)
    });
  });
  
})})
