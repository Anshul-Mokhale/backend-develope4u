import connectDB from '../db/index.js';

const getConnection = async () => {
    return await connectDB();
};

const getAllUsers = async () => {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM users');
    return rows;
};

const createUser = async (userData) => {
    const connection = await getConnection();
    const { name, email } = userData;
    const [result] = await connection.execute(
        'INSERT INTO users (name, email, created_at) VALUES (?, ?, NOW())', 
        [name, email]
    );
    
    return result;
};

export default { getConnection, getAllUsers, createUser };
