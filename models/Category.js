const pool = require('../config/database');
const { makeOrderByQuery } = require('./utils/makeOrderByQuery');
const { makeUpdateQuery } = require('./utils/makeUpdateQuery');

const validSortColumns = ['id', 'name'];

class Category {
  constructor(name) {
    this.name = name;
  }

  async save() {
    const sql = 'INSERT INTO categories (name) VALUES($1) RETURNING *';

    return pool.query(sql, [this.name]);
  }

  static getAll(query) {
    const orderBy = makeOrderByQuery(query, validSortColumns);
    const sql = `SELECT * FROM categories ${orderBy}`;

    return pool.query(sql);
  }

  static getWithAmount() {
    const sql = `
      SELECT categories.id as category_id, categories.name, COUNT(lots.category_id) as amount
        FROM categories
          LEFT JOIN lots ON categories.id = lots.category_id
            GROUP BY categories.id
              ORDER BY amount DESC
    `;

    return pool.query(sql);
  }

  static getById(id) {
    const sql = 'SELECT * FROM categories WHERE id = $1';

    return pool.query(sql, [id]);
  }

  static editData(values, id) {
    const { query, params } = makeUpdateQuery(values);

    const sql = `UPDATE categories SET ${query} WHERE id = $${params.length + 1} RETURNING *`;

    return pool.query(sql, [...params, id]);
  }

  static delete(id) {
    const sql = 'DELETE FROM categories WHERE id = $1';

    return pool.query(sql, [id]);
  }
}

module.exports = Category;