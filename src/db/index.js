import mysql from 'mysql2/promise';

let pool;

const connectDB = async () => {
    // Check if the pool is already created
    if (pool) {
        return pool;
    }

    const host = process.env.DB_HOST || 'localhost';
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'develope4u';

    if (!host || !user || !database) {
        console.error("MySQL connection configuration is missing: ", { host, user, password, database });
        throw new Error("MySQL connection configuration is missing.");
    }

    try {
        // Create the MySQL connection pool
        pool = await mysql.createPool({
            host,
            user,
            password,
            database,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log(`MySQL Pool Connected: ${host}`);
        return pool;
    } catch (error) {
        console.error('MySQL Connection Pool error:', error);
        throw error; // Rethrow to propagate the error
    }
};

export default connectDB;
