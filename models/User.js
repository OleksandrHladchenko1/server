const pool = require('../config/database');
const { makeOrderByQuery } = require('./utils/makeOrderByQuery');
const { makeUpdateQuery } = require('./utils/makeUpdateQuery');

class User {
  static getAll(query) {
    const orderBy = makeOrderByQuery(query);
    const sql = `SELECT * FROM users ${orderBy}`;

    return pool.query(sql);
  }

  static getById(id) {
    const sql = 'SELECT * FROM users WHERE id = $1';

    return pool.query(sql, [id]);
  }

  static editData(values, id) {
    const { query, params } = makeUpdateQuery(values);
  
    const sql = `UPDATE users SET ${query} WHERE id = $${params.length + 1} RETURNING *`;

    return pool.query(sql, [...params, id]);
  }

  static delete(id) {
    const sql = 'DELETE FROM users WHERE id = $1';

    return pool.query(sql, [id]);
  }

  /* static updateRating(rating, id) {
    const sql = `UPDATE user SET rating = ${rating} WHERE id = ${id}`;

    return database.execute(sql);
  } */
}

module.exports = User;