import User from '../models/user.model.js';

const getUsers = async (req, res) => {
    try {
        const connection = await User.getConnection();
        const [rows] = await connection.execute('SELECT * FROM users');
        res.status(200).json({ users: rows });
    } catch (error) {
        res.status(500).json({ error: 'Database query failed' });
    }
};

const addUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const connection = await User.getConnection();
        // const [result] = await connection.execute(
        //     'INSERT INTO users (name, email) VALUES (?, ?)', 
        //     [name, email]
        // );
        const insert = User.createUser({name,email});
        
        res.status(201).json({ message: 'User created', userId: insert.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export { getUsers, addUser };
