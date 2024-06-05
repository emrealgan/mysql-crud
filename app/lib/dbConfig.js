export const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  waitForConnections: true,
};
