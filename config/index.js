const HOST = 'http://localhost:'
const PORT = 3006
const ENV = process.env.NODE_ENV || 'PRODUCTION';

const MYSQL_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  port: '3306',
  database: 'myblog',
}

const REDIS_CONFIG = {
  port: 6379,
  host: '127.0.0.1'
}

module.exports = {
  HOST,
  PORT,
  ENV,
  MYSQL_CONFIG,
  REDIS_CONFIG,
}
