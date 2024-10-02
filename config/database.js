const Pool = require('pg').Pool;


const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});
/* const pool = new Pool({
  user: 'postgres',
  password: 'admin',
  host: 'localhost',
  port: 5432,
  database: 'auction',
}); */

module.exports = pool;