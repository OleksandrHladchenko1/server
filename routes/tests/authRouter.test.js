const request = require('supertest');
const express = require('express');
const authRoutes = require('../authRouter');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth router', () => {
  it('should register a user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
      });
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User has been successfuly registered!');
  });

  it('should log in a user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'password123',
      });
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Successfuly logged in!');
    expect(response.body.data.user).toHaveProperty('email', 'john.doe@example.com');
  });

  it('should change the user password', async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'password123',
      });

    const token = loginResponse.body.data.token;

    const response = await request(app)
      .patch('/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'john.doe@example.com',
        password: 'newpassword123',
        passwordConfirm: 'newpassword123',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User\'s password has been successfuly updated!');
  });
});
