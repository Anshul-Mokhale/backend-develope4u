import connectDB from '../db/index.js';
import User from "./user.model.js";
import bcrypt from 'bcrypt';

// Establish a database connection
const getConnection = async () => {
    try {
        return await connectDB();
    } catch (error) {
        console.error("Error establishing database connection:", error.message);
        throw new Error("Database connection failed");
    }
};

const adminLogin = async (userData) => {
    try {
        const connection = await getConnection();
        const { email, password } = userData;
        const query = `SELECT id, password FROM users WHERE email = ? AND user_type = 'admin'`;
        const [rows] = await connection.execute(query, [email]);

        if (rows.length === 0) {
            return { status: 0, message: 'User not found' };
        }

        const { id, password: hashedPassword } = rows[0];
        const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

        if (!isPasswordMatch) {
            return { status: 0, message: 'Invalid credentials' };
        }

        const token = await User.generateAccessToken(id);
        const updateQuery = `UPDATE users SET access_token = ? WHERE id = ?`;
        const [updateResult] = await connection.execute(updateQuery, [token, id]);

        if (updateResult.affectedRows === 0) {
            return { status: 0, message: 'Failed to update access token' };
        }

        return { status: 1, message: 'Login successful', accessToken: token };

    } catch (error) {
        console.error("Error logging in user:", error.message);
        throw new Error("Failed to login user");
    }
}

const fetchData = async () => {
    try {
        const connection = await getConnection();
        const query = `
            SELECT user_type, COUNT(*) as count
            FROM users
            WHERE user_type IN ('student', 'business')
            GROUP BY user_type
        `;
        const [rows] = await connection.execute(query);

        // Process the result
        const studentCount = rows.find(row => row.user_type === 'student')?.count || 0;
        const businessCount = rows.find(row => row.user_type === 'business')?.count || 0;

        if (!studentCount && !businessCount) {
            return { status: 0, message: 'No data found' };
        }
        return { status: 1, data: { studentCount, businessCount }, message: 'Data fetched successfully' };
    } catch (error) {
        console.error("Error logging in user:", error.message);
        throw new Error("Failed to login user");
    }
}

// user status change

const changeStatus = async (id, status) => {
    try {
        const connection = await getConnection();
        const query = `UPDATE users SET status = ? WHERE id = ? AND user_type = 'student'`;
        const [rows] = await connection.execute(query, [status, id]);

        if (rows.affectedRows === 0) {
            return { status: 0, message: 'Failed to change status' };
        }
        return { status: 1, message: 'Status changed successfully' };
    } catch (error) {
        console.error("Error logging in user:", error.message);
        throw new Error("Failed to login user");
    }
}

const fetchUsers = async (userId) => {
    try {
        const connection = await getConnection();
        const query = `SELECT * FROM users WHERE id = ?`;
        const [rows] = await connection.execute(query, [userId]);
        if (rows.length === 0) {
            return { status: 0, message: 'User not found' };
        }
        return { status: 1, data: rows, message: 'Data fetched successfully' };
    } catch (error) {
        console.error("Error fetching user:", error.message);
        throw new Error("Failed to fetch user");
    }
}

const fetchUserList = async () => {
    try {
        const connection = await getConnection();
        const query = `SELECT id,name,email,created_at,updated_at FROM users Where user_type = 'student'`;
        const [rows] = await connection.execute(query);
        if (rows.length === 0) {
            return { status: 0, message: 'User not found' };
        }
        return { status: 1, data: rows, message: 'Data fetched successfully' };
    } catch (error) {
        console.error("Error fetching user:", error.message);
        throw new Error("Failed to fetch user");
    }
}

const deleteUser = async (userId) => {
    try {
        const connection = await getConnection();
        const query = `DELETE FROM users WHERE id = ? AND user_type = 'student'`;
        const [rows] = await connection.execute(query, [userId]);
        if (rows.affectedRows === 0) {
            return { status: 0, message: 'User not found' };
        }
        return { status: 1, message: 'User deleted successfully' };
    } catch (error) {
        console.error("Error fetching user:", error.message);
        throw new Error("Failed to fetch user");
    }
}

// admin management
const changeBusinessStatus = async (id, status) => {
    try {
        const connection = await getConnection();
        const query = `UPDATE users SET status = ? WHERE id = ? AND user_type = 'business'`;
        const [rows] = await connection.execute(query, [status, id]);

        if (rows.affectedRows === 0) {
            return { status: 0, message: 'Failed to change status' };
        }
        return { status: 1, message: 'Status changed successfully' };
    } catch (error) {
        console.error("Error logging in user:", error.message);
        throw new Error("Failed to login user");
    }
}

const fetchBusiness = async (userId) => {
    try {
        const connection = await getConnection();
        const query = `SELECT * FROM users WHERE id = ? AND user_type = 'business'`;
        const [rows] = await connection.execute(query, [userId]);
        if (rows.length === 0) {
            return { status: 0, message: 'User not found' };
        }
        return { status: 1, data: rows, message: 'Data fetched successfully' };
    } catch (error) {
        console.error("Error fetching user:", error.message);
        throw new Error("Failed to fetch user");
    }
}

const fetchBusinessList = async () => {
    try {
        const connection = await getConnection();
        const query = `SELECT id,name,email,created_at,updated_at FROM users Where user_type = 'business'`;
        const [rows] = await connection.execute(query);
        if (rows.length === 0) {
            return { status: 0, message: 'User not found' };
        }
        return { status: 1, data: rows, message: 'Data fetched successfully' };
    } catch (error) {
        console.error("Error fetching user:", error.message);
        throw new Error("Failed to fetch user");
    }
}

const deleteBusiness = async (userId) => {
    try {
        const connection = await getConnection();
        const query = `DELETE FROM users WHERE id = ? AND user_type = 'business'`;
        const [rows] = await connection.execute(query, [userId]);
        if (rows.affectedRows === 0) {
            return { status: 0, message: 'User not found' };
        }
        return { status: 1, message: 'User deleted successfully' };
    } catch (error) {
        console.error("Error fetching user:", error.message);
        throw new Error("Failed to fetch user");
    }
}



export default {
    adminLogin,
    fetchData,
    changeStatus,
    fetchUsers,
    fetchUserList,
    deleteUser,
    changeBusinessStatus,
    fetchBusiness,
    fetchBusinessList,
    deleteBusiness,

};