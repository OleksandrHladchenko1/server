const pool = require('../config/database');
const { makeOrderByQuery } = require('./utils/makeOrderByQuery');
const { makeUpdateQuery } = require('./utils/makeUpdateQuery');

const validSortColumns = [
  'id',
  'start_time',
  'end_time',
  'final_bid',
  'status',
];

class Event {
  constructor(data) {
    this.data = data;
  }

  async save() {
    const sql = 'INSERT INTO events (lot_id, start_time) VALUES ($1, $2) RETURNING *';

    return pool.query(sql, [this.data.lot_id, this.data.start_time]);
  }

  static getAll(query) {
    const orderBy = makeOrderByQuery(query, validSortColumns);
    const sql = `
      SELECT
        e.id,
        e.start_time,
        e.end_time,
        e.final_bid,
        e.status,
        json_build_object(
          'id', l.id,
          'title', l.title,
          'starting_bid', l.starting_bid,
          'increment', l.increment,
          'percent_for_me', l.percent_for_me
        ) AS lot
      FROM events e
      INNER JOIN lots l on e.lot_id = l.id
      ${orderBy}
    `;

    return pool.query(sql);
  }

  static getById(id) {
    const sql = `
      SELECT
        e.id,
        e.start_time,
        e.end_time,
        e.final_bid,
        e.status,
        json_build_object(
              'id', l.id,
              'title', l.title,
          'description', l.description,
          'starting_bid', l.starting_bid,
          'increment', l.increment,
          'percent_for_me', l.percent_for_me,
          'status', l.status
          ) AS lot,
        json_build_object(
          'id', u.id,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'given_name', u.given_name,
          'user_name', u.user_name,
          'email', u.email,
          'rating', u.rating
        ) as seller,
        json_build_object(
          'id', c.id,
          'name', c.name
        ) as category
      FROM events e
      INNER JOIN lots l ON e.lot_id = l.id
      INNER JOIN users u ON l.seller_id = u.id
      INNER JOIN categories c ON l.category_id = c.id
      WHERE e.id = $1
    `;

    return pool.query(sql, [id]);
  }

  static editData(values, id) {
    const { query, params } = makeUpdateQuery(values);

    const sql = `UPDATE events SET ${query} WHERE id = $${params.length + 1} RETURNING *`;

    return pool.query(sql, [...params, id]);
  }

  static delete(id) {
    const sql = 'DELETE FROM events WHERE id = $1';

    return pool.query(sql, [id]);
  }
}

module.exports = Event;
