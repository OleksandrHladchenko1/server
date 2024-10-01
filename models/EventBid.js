const pool = require('../config/database');
const { makeOrderByQuery } = require('./utils/makeOrderByQuery');
const { makeUpdateQuery } = require('./utils/makeUpdateQuery');

const validSortColumns = [
  'id',
  'created_at',
];

class EventBid {
  constructor(data) {
    this.data = data;
  }

  async save() {
    const sql = 'INSERT INTO event_bids (event_id, user_id, bid_amount) VALUES ($1, $2, $3) RETURNING *';

    return pool.query(sql, [this.data.event_id, this.data.user_id, this.data.bid_amount]);
  }

  static getAllEventBids(query, eventId) {
    const orderBy = makeOrderByQuery(query, validSortColumns);
    const sql = `
      SELECT 
        b.id,
        b.bid_amount,
        b.created_at,
        json_build_object(
          'id', u.id,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'given_name', u.given_name,
          'user_name', u.user_name,
          'email', u.email,
          'rating', u.rating
        ) as user
      FROM event_bids b
      INNER JOIN users u ON b.user_id = u.id
      WHERE event_id = $1
      ${orderBy}
    `;

    return pool.query(sql, [eventId]);
  }

  static getEventBidById(id) {
    const sql = `
      SELECT 
        b.id,
        b.bid_amount,
        b.created_at,
        json_build_object(
          'id', u.id,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'given_name', u.given_name,
          'user_name', u.user_name,
          'email', u.email,
          'rating', u.rating
        ) as user
      FROM event_bids b
      INNER JOIN users u ON b.user_id = u.id
      WHERE b.id = $1
    `;

    return pool.query(sql, [id]);
  }

  static editEventBidData(values, id) {
    const { query, params } = makeUpdateQuery(values);

    const sql = `UPDATE event_bids SET ${query} WHERE id = $${params.length + 1} RETURNING *`;

    return pool.query(sql, [...params, id]);
  }

  static deleteEventBid(id) {
    const sql = 'DELETE FROM event_bids WHERE id = $1';

    return pool.query(sql, [id]);
  }
}

module.exports = EventBid;
