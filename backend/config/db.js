require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinic_appointment_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
pool.getConnection((err, conn) => {
    if(err) console.error("Database connection failed:", err.message);
    else {
        console.log("Connected to MySQL Database.");
        conn.release();
    }
});

module.exports = pool.promise();
