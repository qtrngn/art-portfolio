import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'arts',
  port: 8889,
  waitForConnections: true,
  connectionLimit: 10,
});
export default pool;
