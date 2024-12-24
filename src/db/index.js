import mysql from 'mysql2/promise';

// Singleton connection instance
let connection;

const connectDB = async () => {
    if (connection) {
        // If a connection already exists, return it
        console.log('Using existing MySQL connection');
        return connection;
    }

    try {
        // Create a new connection if it doesn't exist
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'develope4u',
        });

        console.log(`MySQL Connected: ${connection.config.host}`);
        return connection;
    } catch (error) {
        console.error('MySQL Connection error', error);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
