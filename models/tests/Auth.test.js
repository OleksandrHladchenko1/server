const pool = require('../../config/database');
const Auth = require('../Auth');

jest.mock('../../config/database');

describe('Auth model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserByEmail method', () => {
    const mockUser = { id: 1, email: 'test@example.com' };

    it('should execute SELECT query with correct parameters', async () => {
      pool.query.mockResolvedValue({ rows: [mockUser] });

      const result = await Auth.getUserByEmail(mockUser.email);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith('SELECT * from users WHERE email = $1', [mockUser.email]);
      expect(result).toEqual({ rows: [mockUser] });
    });

    it('should handle errors during the query', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      await expect(Auth.getUserByEmail(mockUser.email)).rejects.toThrow('Database error');
    });
  });

  describe('registerUser method', () => {
    it('should execute INSERT query with correct parameters', async () => {
      const newUser = { firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'password' };
      const mockResponse = { rows: [{ id: 1, ...newUser }] };
      pool.query.mockResolvedValue({ rows: [{ id: 1, ...newUser }] });

      const result = await Auth.registerUser(newUser);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
        [newUser.firstName, newUser.lastName, newUser.email, newUser.password]
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('changePassword method', () => {
    const userData = { email: 'john@example.com', password: 'newpassword' };
    
    it('should execute UPDATE query with correct parameters', async () => {
      pool.query.mockResolvedValue({ rowCount: 1 });

      const result = await Auth.changePassword(userData);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE users SET password = $1 WHERE email = $2',
        [userData.password, userData.email]
      );
      expect(result).toEqual({ rowCount: 1 });
    });

    it('should handle errors during changing the password', async () => {
      pool.query.mockRejectedValue(new Error('Update failed'));

      await expect(Auth.changePassword(userData)).rejects.toThrow('Update failed');
    });
  });
});
