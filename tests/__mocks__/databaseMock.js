const pool = require('../../config/database');

jest.mock('../../config/database', () => ({
  query: jest.fn(),
  end: jest.fn(),
}));

module.exports = pool;
