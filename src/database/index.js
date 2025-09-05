import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Configuration for FreeSQLDatabase.com
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: false, // FreeSQLDatabase doesn't use SSL
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
};

const pool = mysql.createPool(dbConfig);

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected successfully");
    console.log(`Connected to: ${process.env.DB_HOST}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
};

// Initialize database tables if needed (compatible with very old MySQL)
const initializeDatabase = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(500) NOT NULL,
        latitude FLOAT(10, 6) NOT NULL,
        longitude FLOAT(10, 6) NOT NULL,
        created_at TIMESTAMP NULL DEFAULT NULL,
        updated_at TIMESTAMP NULL DEFAULT NULL
      )
    `;
    await pool.execute(createTableQuery);

    const createIndexQuery = `CREATE INDEX IF NOT EXISTS idx_coordinates ON schools (latitude, longitude)`;
    await pool.execute(createIndexQuery);

    console.log("Database tables initialized");
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    throw error;
  }
};

export { pool, testConnection, initializeDatabase };
