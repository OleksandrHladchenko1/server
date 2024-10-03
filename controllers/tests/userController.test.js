const request = require('supertest');
const express = require('express');
const userController = require('../userController');
const User = require('../../models/User');

const app = express();
app.use(express.json());
app.route('/users').get(userController.getAllUsers);
app.route('/users/:id')
  .get(userController.getUserById)
  .patch(userController.editUserData)
  .delete(userController.deleteUser);

jest.mock('../../models/User');

describe('User controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers method', () => {
    it('should return users and totalCount', async () => {
      const mockUsers = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];
      User.getAll.mockResolvedValue({ rows: mockUsers, rowCount: mockUsers.length });
  
      const response = await request(app).get('/users');
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        users: mockUsers,
        totalCount: mockUsers.length,
      });
    });
  });

  describe('getUserById method', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: 1, name: 'John Doe' };
      User.getById.mockResolvedValue({ rows: [mockUser] });
  
      const response = await request(app).get('/users/1');
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ user: mockUser });
    });

    it('should return 404 if user was not found', async () => {
      User.getById.mockResolvedValue({ rows: [] });
  
      const response = await request(app).get('/users/999');
  
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'User with id 999 was not found!' });
    });
  });

  describe('editUserData method', () => {
    it('should update user data', async () => {
      const mockUser = { id: 1, name: 'John Doe' };
      const mockBody = { name: 'John Updated' };
      User.editData.mockResolvedValue({ rows: [mockUser] });
  
      const response = await request(app).patch('/users/1').send(mockBody);
  
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: 'User has been successfuly updated!', data: mockUser });
    });
  });

  describe('deleteUser method', () => {
    it('should delete a user', async () => {
      User.delete.mockResolvedValue();
  
      const response = await request(app).delete('/users/1');
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'User has been successfuly deleted!' });
    });
  });
});