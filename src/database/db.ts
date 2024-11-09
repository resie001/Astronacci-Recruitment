import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create a pool of connections for PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,     // Your PostgreSQL username
    host: process.env.DB_HOST,         // PostgreSQL host (localhost if running locally)
    database: process.env.DB_NAME, // The name of your database
    password: process.env.DB_PASSWORD, // Your PostgreSQL password
    port: parseInt(process.env.DB_PORT || '5432', 10),              // Default PostgreSQL port
});

export default pool;