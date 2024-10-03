const { databaseMock } = require('../../tests/__mocks__');

const Category = require('../Category');

const { makeOrderByQuery } = require('../utils/makeOrderByQuery');
const { makeUpdateQuery } = require('../utils/makeUpdateQuery');

jest.mock('../utils/makeOrderByQuery');
jest.mock('../utils/makeUpdateQuery');

describe('Category model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save method', () => {
    it('should insert a category into the database', async () => {
      const category = new Category('Test Category');

      databaseMock.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Test Category' }] });

      const result = await category.save();

      expect(databaseMock.query).toHaveBeenCalledWith('INSERT INTO categories (name) VALUES($1) RETURNING *', ['Test Category']);
      expect(result).toEqual({ rows: [{ id: 1, name: 'Test Category' }] });
    });
  });

  describe('getAll method', () => {
    it('should get all categories with optional sorting', async () => {
      const mockQuery = { sort: 'name' };
      makeOrderByQuery.mockReturnValue('ORDER BY name');

      databaseMock.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Test Category' }] });

      const result = await Category.getAll(mockQuery);

      expect(makeOrderByQuery).toHaveBeenCalledWith(mockQuery, ['id', 'name']);
      expect(databaseMock.query).toHaveBeenCalledWith('SELECT * FROM categories ORDER BY name');
      expect(result).toEqual({ rows: [{ id: 1, name: 'Test Category' }] });
    });
  });

  describe('getWithAmount method', () => {
    it('should get categories with amount of lots', async () => {
      const sql = `
      SELECT categories.id as category_id, categories.name, COUNT(lots.category_id) as amount
        FROM categories
          LEFT JOIN lots ON categories.id = lots.category_id
            GROUP BY categories.id
              ORDER BY amount DESC
    `;

      databaseMock.query.mockResolvedValueOnce({
        rows: [
          { category_id: 1, name: 'Test Category', amount: 3 },
        ],
      });

      const result = await Category.getWithAmount();

      expect(databaseMock.query).toHaveBeenCalledWith(sql);
      expect(result).toEqual({
        rows: [{ category_id: 1, name: 'Test Category', amount: 3 }],
      });
    });
  });

  describe('getById method', () => {
    it('should get category by id', async () => {
      databaseMock.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Test Category' }] });

      const result = await Category.getById(1);

      expect(databaseMock.query).toHaveBeenCalledWith('SELECT * FROM categories WHERE id = $1', [1]);
      expect(result).toEqual({ rows: [{ id: 1, name: 'Test Category' }] });
    });
  });

  describe('editData method', () => {
    it('should update a category and return the updated row', async () => {
      const mockValues = { name: 'Updated Category' };
      makeUpdateQuery.mockReturnValue({ query: 'name = $1', params: ['Updated Category'] });

      databaseMock.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Updated Category' }] });

      const result = await Category.editData(mockValues, 1);

      expect(makeUpdateQuery).toHaveBeenCalledWith(mockValues);
      expect(databaseMock.query).toHaveBeenCalledWith('UPDATE categories SET name = $1 WHERE id = $2 RETURNING *', ['Updated Category', 1]);
      expect(result).toEqual({ rows: [{ id: 1, name: 'Updated Category' }] });
    });
  });

  describe('delete method', () => {
    it('should delete a category by id', async () => {
      databaseMock.query.mockResolvedValueOnce({ rowCount: 1 });

      const result = await Category.delete(1);

      expect(databaseMock.query).toHaveBeenCalledWith('DELETE FROM categories WHERE id = $1', [1]);
      expect(result).toEqual({ rowCount: 1 });
    });
  });
});
