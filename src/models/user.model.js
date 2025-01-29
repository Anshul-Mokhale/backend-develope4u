import connectDB from '../db/index.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

// Helper to execute queries
const executeQuery = async (query, values) => {
    const pool = await connectDB(); // Get the connection pool
    try {
        return await pool.execute(query, values); // Use pool.execute to run queries
    } catch (error) {
        console.error("Error executing query:", error.message);
        throw new Error("Database query failed");
    }
};

// Generate an access token for a user
const generateAccessToken = async (id) => {
    try {
        if (!process.env.ACCESS_TOKEN_SECRET || !process.env.ACCESS_TOKEN_EXPIRY) {
            throw new Error("ACCESS_TOKEN_SECRET or ACCESS_TOKEN_EXPIRY is not defined in the environment variables");
        }

        return jwt.sign(
            { id }, // Payload
            process.env.ACCESS_TOKEN_SECRET, // Secret
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // Options
        );
    } catch (error) {
        console.error("Error generating access token:", error.message);
        throw new Error("Failed to generate access token");
    }
};

// Fetch all users from the database
const getAllUsers = async () => {
    try {
        const query = 'SELECT * FROM users';
        const [rows] = await executeQuery(query);
        return rows;
    } catch (error) {
        console.error("Error fetching all users:", error.message);
        throw new Error("Failed to fetch users");
    }
};

// Create a new student user
const createStudent = async (userData, fileUrl) => {
    if (!fileUrl) return { file: "No file found" };

    try {
        const password = await bcrypt.hash(userData.password, SALT_ROUNDS);
        const { name, email, phone, user_type, age, college_name, field_of_study, graduation_year } = userData;

        const query = `
            INSERT INTO users (name, email, phone, password, user_type, age, college_name, field_of_study, graduation_year, proof) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [name, email, phone, password, user_type, age, college_name, field_of_study, graduation_year, fileUrl];

        const [result] = await executeQuery(query, values);
        return { userId: result.insertId };
    } catch (error) {
        console.error("Error creating student user:", error.message);
        throw new Error("Failed to create student");
    }
};

// Create a new business user
const createBusiness = async (userData) => {
    try {
        const password = await bcrypt.hash(userData.password, SALT_ROUNDS);
        const { name, email, phone, user_type, age, company_name, company_field } = userData;

        const query = `
            INSERT INTO users (name, email, phone, password, user_type, age, company_name, company_field) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [name, email, phone, password, user_type, age, company_name, company_field];

        const [result] = await executeQuery(query, values);
        return { userId: result.insertId };
    } catch (error) {
        console.error("Error creating business user:", error.message);
        throw new Error("Failed to create business");
    }
};

// User login function
const userLogin = async (userData) => {
    try {
        const { email, password } = userData;

        const query = `SELECT id, password, status FROM users WHERE email = ?`;
        const [rows] = await executeQuery(query, [email]);

        if (rows.length === 0) {
            return { status: 0, message: 'User not found' };
        }

        const { id, password: hashedPassword, status } = rows[0];
        if (status !== 'active') {
            return { status: 0, message: 'User is not active' };
        }

        const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
        if (!isPasswordMatch) {
            return { status: 0, message: 'Invalid credentials' };
        }

        const token = await generateAccessToken(id);
        const updateQuery = `UPDATE users SET access_token = ? WHERE id = ?`;
        const [updateResult] = await executeQuery(updateQuery, [token, id]);

        if (updateResult.affectedRows === 0) {
            return { status: 0, message: 'Failed to update access token' };
        }

        return { status: 1, message: 'Login successful', accessToken: token };
    } catch (error) {
        console.error('Error during user login:', error.message);
        return { status: 0, message: 'An error occurred during login' };
    }
};

// Fetch a user by ID
const fetchUser = async (id) => {
    try {
        const query = 'SELECT * FROM users WHERE id = ?';
        const [rows] = await executeQuery(query, [id]);

        return { status: 1, data: rows, message: 'Successful' };
    } catch (error) {
        console.error("Error fetching user:", error.message);
        return { status: 0, message: 'Failed to fetch user' };
    }
};

// Update student data by ID
const updateStudentData = async (id, name) => {
    if (!id) return { status: 0, message: "No ID found" };

    try {
        const query = 'UPDATE users SET name = ? WHERE id = ?';
        const [rows] = await executeQuery(query, [name, id]);

        if (rows.affectedRows > 0) {
            return { status: 1, data: rows, message: "Update successful" };
        } else {
            return { status: 0, data: rows, message: "Failed to update: User not found or no changes made" };
        }
    } catch (error) {
        console.error("Error updating user:", error.message);
        return { status: 0, message: 'Failed to update user' };
    }
};

// Add a project comment
const addProjectComment = async (projectId, comment, name) => {
    try {
        const query = `SELECT comment FROM projects WHERE id = ?`;
        const [rows] = await executeQuery(query, [projectId]);

        let comments = [];
        if (rows.length > 0 && rows[0].comment) {
            comments = JSON.parse(rows[0].comment);
        }

        comments.push({ name, comment });

        const updateQuery = `UPDATE projects SET comment = ? WHERE id = ?`;
        const [result] = await executeQuery(updateQuery, [JSON.stringify(comments), projectId]);

        if (result.affectedRows === 0) {
            return { status: 0, message: 'Failed to add comment' };
        }

        return { status: 1, message: 'Comment added successfully' };
    } catch (error) {
        console.error("Error adding comment:", error.message);
        throw new Error("Failed to add comment");
    }
};

// Get user name by ID
const getUserName = async (id) => {
    try {
        const query = 'SELECT name FROM users WHERE id = ?';
        const [rows] = await executeQuery(query, [id]);

        return rows.length === 0 ? id : rows[0].name;
    } catch (error) {
        console.error("Error fetching user name:", error.message);
        return "User";
    }
};

export default {
    generateAccessToken,
    getAllUsers,
    createStudent,
    createBusiness,
    userLogin,
    fetchUser,
    updateStudentData,
    addProjectComment,
    getUserName
};
