const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = require('../authController');
const Auth = require('../../models/Auth');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../models/Auth');

const app = express();
app.use(express.json());
app.post('/register', authController.registerUser);
app.post('/login', authController.loginUser);
app.put('/change-password', authController.changePassword);

describe('Auth controller', () => {
  describe('registerUser method', () => {
    it('should return 201 and a success message when user is registered', async () => {
      Auth.getUserByEmail.mockResolvedValue({ rows: [] });
      Auth.registerUser.mockResolvedValue({ rows: [{ id: 1, email: 'test@example.com' }] });
      bcrypt.hash.mockResolvedValue('hashedPassword');

      const response = await request(app)
        .post('/register')
        .send({ email: 'test@example.com', password: '123456', passwordConfirm: '123456' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'User has been successfuly registered!',
        data: { id: 1, email: 'test@example.com' }
      });
    });

    it('should return 400 when passwords do not match', async () => {
      const response = await request(app)
        .post('/register')
        .send({ email: 'test@example.com', password: '123456', passwordConfirm: '654321' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Passwords don\'t match!' });
    });

    it('should return 400 when user already exists', async () => {
      Auth.getUserByEmail.mockResolvedValue({ rows: [{ id: 1, email: 'test@example.com' }] });

      const response = await request(app)
        .post('/register')
        .send({ email: 'test@example.com', password: '123456', passwordConfirm: '123456' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'User with email \'test@example.com\' already exists!' });
    });
  });

  describe('loginUser method', () => {
    it('should return 200 and a token when login is successful', async () => {
      Auth.getUserByEmail.mockResolvedValue({ rows: [{ id: 1, email: 'test@example.com', password: 'hashedPassword' }] });
      bcrypt.compareSync.mockReturnValue(true);
      jwt.sign.mockReturnValue('mockToken');

      const response = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: '123456' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Successfuly logged in!',
        data: {
          user: { id: 1, email: 'test@example.com' },
          token: 'mockToken',
        },
      });
    });

    it('should return 400 when passwords do not match', async () => {
      Auth.getUserByEmail.mockResolvedValue({ rows: [{ id: 1, email: 'test@example.com', password: 'hashedPassword' }] });
      bcrypt.compareSync.mockReturnValue(false);

      const response = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'wrongPassword' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Passwords don\'t match!' });
    });

    it('should return 400 when user does not exist', async () => {
      Auth.getUserByEmail.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .post('/login')
        .send({ email: 'nonexistent@example.com', password: '123456' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'User with email \'nonexistent@example.com\' doesn\'t exists!' });
    });
  });

  describe('changePassword method', () => {
    it('should return 200 when password is successfully updated', async () => {
      Auth.getUserByEmail.mockResolvedValue({ rows: [{ id: 1, email: 'test@example.com', password: 'oldPasswordHash' }] });
      bcrypt.compareSync.mockReturnValue(false);
      bcrypt.hash.mockResolvedValue('newHashedPassword');
      Auth.changePassword.mockResolvedValue();

      const response = await request(app)
        .put('/change-password')
        .send({ email: 'test@example.com', password: 'newPassword', passwordConfirm: 'newPassword' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'User\'s password has been successfuly updated!' });
    });

    it('should return 400 when new passwords do not match', async () => {
      const response = await request(app)
        .put('/change-password')
        .send({ email: 'test@example.com', password: 'newPassword', passwordConfirm: 'differentPassword' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'New passwords are NOT the same!' });
    });

    it('should return 400 when old and new passwords are the same', async () => {
      Auth.getUserByEmail.mockResolvedValue({ rows: [{ id: 1, email: 'test@example.com', password: 'oldPassword' }] });
      bcrypt.compareSync.mockReturnValue(true);

      const response = await request(app)
        .put('/change-password')
        .send({ email: 'test@example.com', password: 'oldPassword', passwordConfirm: 'oldPassword' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Old and new password are the same!' });
    });
  });
});
