// import mysql from "mysql2/promise";

// const db = mysql.createPool({
//   host: process.env.MYSQL_HOST || process.env.DB_HOST || "localhost",
//   port: Number(process.env.MYSQL_PORT || process.env.DB_PORT || 3306),
//   user: process.env.MYSQL_USER || process.env.DB_USER || "root",
//   password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || "root123",
//   database: process.env.MYSQL_DATABASE || process.env.DB_NAME || "dailycode",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// export default db;

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

try {
  const connection = await db.getConnection();
  console.log("✅ Database connected successfully!");
  connection.release();
} catch (err) {
  console.error("❌ Database connection failed:");
  console.error(err);
  process.exit(1);
}

export default db;