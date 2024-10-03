const { mockUser } = require('../fixtures');

jest.doMock('../../models/Auth', () => {
  return {
    getUserByEmail: jest.fn().mockResolvedValue({ rows: [mockUser] }),
    registerUser: jest.fn().mockResolvedValue({ rows: [mockUser] }),
  };
});
