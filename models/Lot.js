
const pool = require('../config/database');
const { makeOrderByQuery } = require('./utils/makeOrderByQuery');
const { makeUpdateQuery } = require('./utils/makeUpdateQuery');

const validSortColumns = [
  'id',
  'title',
  'starting_bid',
  'status',
  'created_at',
];

class Lot {
  constructor(data) {
    this.data = data;
  }

  async save() {
    const sql = 'INSERT INTO lots (seller_id, category_id, title, description, starting_bid, increment, percent_for_me)' +
      'VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *';

    return pool.query(sql, [
      this.data.seller_id,
      this.data.category_id,
      this.data.title,
      this.data.description,
      this.data.starting_bid,
      this.data.increment,
      this.data.percent_for_me,
    ]);
  }

  static getAll(query) {
    const orderBy = makeOrderByQuery(query, validSortColumns);
    const sql = `
      SELECT
        l.id,
        l.title,
        l.description,
        l.starting_bid,
        l.increment,
        l.percent_for_me,
        l.end_time,
        l.status,
        l.created_at,
        l.updated_at,
        json_build_object(
          'id', u.id,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'given_name', u.given_name,
          'user_name', u.user_name,
          'email', u.email,
          'rating', u.rating
        ) AS seller,
        json_build_object(
          'id', c.id,
          'name', c.name
        ) AS category
      FROM lots l
      INNER JOIN users u ON l.seller_id = u.id
      INNER JOIN categories c ON l.category_id = c.id
      ${orderBy}
    `;

    return pool.query(sql);
  }

  static getById(id) {
    const sql = `
      SELECT
        l.id,
        l.title,
        l.description,
        l.starting_bid,
        l.increment,
        l.percent_for_me,
        l.end_time,
        l.status,
        l.created_at,
        l.updated_at,
        json_build_object(
          'id', u.id,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'given_name', u.given_name,
          'user_name', u.user_name,
          'email', u.email,
          'rating', u.rating
        ) AS seller,
        json_build_object(
          'id', c.id,
          'name', c.name
        ) AS category
      FROM lots l
      INNER JOIN users u ON l.seller_id = u.id
      INNER JOIN categories c ON l.category_id = c.id
      WHERE l.id = $1
    `;

    return pool.query(sql, [id]);
  }

  static getByUserId(userId) {
    const sql = 'SELECT * FROM lots WHERE seller_id = $1';

    return pool.query(sql, [userId]);
  }

  static getByStatus(status) {
    const sql = 'SELECT * FROM lots WHERE status = $1';

    return pool.query(sql, [status]);
  }

  static getByCategory(categoryId) {
    const sql = 'SELECT * FROM lots WHERE category_id = $1';

    return pool.query(sql, [categoryId]);
  }

  static getByTitle(title) {
    const sql = 'SELECT * FROM lots WHERE title ILIKE $1';
    const formattedTitle = `%${title}%`;
  
    return pool.query(sql, [formattedTitle]);
  }

  static editData(values, id) {
    const { query, params } = makeUpdateQuery(values);

    const sql = `UPDATE lots SET ${query} WHERE id = $${params.length + 1} RETURNING *`;

    return pool.query(sql, [...params, id]);
  }

  static delete(id) {
    const sql = 'DELETE FROM lots WHERE id = $1';

    return pool.query(sql, [id]);
  }
}

module.exports = Lot;