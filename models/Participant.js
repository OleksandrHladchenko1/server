const pool = require('../config/database');
const { makeOrderByQuery } = require('./utils/makeOrderByQuery');
const { makeUpdateQuery } = require('./utils/makeUpdateQuery');

const validSortColumns = [
  'id',
  'join_date',
];

class Participant {
  constructor(data) {
    this.data = data;
  }

  async save() {
    const sql = 'INSERT INTO participants (user_id, event_id) VALUES ($1, $2) RETURNING *';

    return pool.query(sql, [this.data.user_id, this.data.event_id]);
  }

  static getEventParticipants(query, eventId) {
    const orderBy = makeOrderByQuery(query, validSortColumns);
    const sql = `
      SELECT 
        p.id,
        p.join_date,
        json_build_object(
          'id', u.id,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'given_name', u.given_name,
          'user_name', u.user_name,
          'email', u.email,
          'rating', u.rating
        ) as participant
      FROM participants p
      INNER JOIN users u ON p.user_id = u.id
      INNER JOIN events e ON p.event_id = e.id
      WHERE event_id = $1
      ${orderBy}
    `;

    return pool.query(sql, [eventId]);
  }

  static getById(id) {
    const sql = `
      SELECT 
        p.id,
        p.join_date,
        json_build_object(
          'id', u.id,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'given_name', u.given_name,
          'user_name', u.user_name,
          'email', u.email,
          'rating', u.rating
        ) as participant
      FROM participants p
      INNER JOIN users u ON p.user_id = u.id
      INNER JOIN events e ON p.event_id = e.id
      WHERE p.id = $1
    `;

    return pool.query(sql, [id]);
  }

  static editData(values, id) {
    const { query, params } = makeUpdateQuery(values);

    const sql = `UPDATE participants SET ${query} WHERE id = $${params.length + 1} RETURNING *`;

    return pool.query(sql, [...params, id]);
  }

  static delete(id) {
    const sql = 'DELETE FROM participants WHERE id = $1';

    return pool.query(sql, [id]);
  }
}

module.exports = Participant;
