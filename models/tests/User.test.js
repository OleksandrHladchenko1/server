const { databaseMock } = require('../../tests/__mocks__');

const User = require('../User');

describe('User model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll method', () => {
    it('should retrieve all users with correct ordering', async () => {
      const mockQuery = {};
      const expectedResponse = { rows: [{ id: 1, first_name: 'John', last_name: 'Doe' }] };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const result = await User.getAll(mockQuery);

      expect(databaseMock.query).toHaveBeenCalledWith('SELECT * FROM users ORDER BY id ASC');
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getById method', () => {
    it('should retrieve a user by its ID', async () => {
      const userId = 1;
      const expectedResponse = { rows: [{ id: userId, first_name: 'John', last_name: 'Doe' }] };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const result = await User.getById(userId);

      expect(databaseMock.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', [userId]);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('editData method', () => {
    it('should update user data and return the updated row', async () => {
      const userId = 1;
      const updatedValues = { first_name: 'Jane' };
      const expectedResponse = { rows: [{ id: userId, first_name: 'Jane', last_name: 'Doe' }] };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const result = await User.editData(updatedValues, userId);

      expect(databaseMock.query).toHaveBeenCalledWith(
        'UPDATE users SET first_name = $1 WHERE id = $2 RETURNING *',
        [updatedValues.first_name, userId]
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('delete method', () => {
    it('should delete a user by its ID', async () => {
      const userId = 1;
      const expectedResponse = { rowCount: 1 };
      databaseMock.query.mockResolvedValueOnce(expectedResponse);

      const result = await User.delete(userId);

      expect(databaseMock.query).toHaveBeenCalledWith('DELETE FROM users WHERE id = $1', [userId]);
      expect(result).toEqual(expectedResponse);
    });
  });
});
