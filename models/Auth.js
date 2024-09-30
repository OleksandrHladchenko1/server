const pool = require('../config/database');

class Auth {
  static getUserByEmail(email) {
    const sql = 'SELECT * from users WHERE email = $1';

    return pool.query(sql, [email]);
  }

  static registerUser({ firstName, lastName, email, password }) {
    const sql = 'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *';

    return pool.query(sql, [firstName, lastName, email, password]);
  }

  static changePassword({ email, password }) {
    const sql = 'UPDATE users SET password = $1 WHERE email = $2';

    return pool.query(sql, [password, email]);
  }
}

module.exports = Auth;