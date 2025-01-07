import connectDB from '../db/index.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

// Establish a database connection
const getConnection = async () => {
    try {
        return await connectDB();
    } catch (error) {
        console.error("Error establishing database connection:", error.message);
        throw new Error("Database connection failed");
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
        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT * FROM users');
        return rows;
    } catch (error) {
        console.error("Error fetching all users:", error.message);
        throw new Error("Failed to fetch users");
    }
};

// Create a new student user
const createStudent = async (userData, fileUrl) => {
    try {
        const connection = await getConnection();
        const password = await bcrypt.hash(userData.password, 10);
        if (!fileUrl) {
            return { file: "no file found" };
        }
        // console.log(userData, fileUrl);
        const { name, email, phone, user_type, age, college_name, field_of_study, graduation_year } = userData;
        const query = `
            INSERT INTO users (name, email, phone, password, user_type, age, college_name, field_of_study, graduation_year, proof) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [name, email, phone, password, user_type, age, college_name, field_of_study, graduation_year, fileUrl];
        const [result] = await connection.execute(query, values);

        return { userId: result.insertId };
    } catch (error) {
        console.error("Error creating student user:", error.message);
        throw new Error("Failed to create student");
    }
};

// Create a new business user
const createBusiness = async (userData) => {
    try {
        const connection = await getConnection();
        const password = await bcrypt.hash(userData.password, 10);
        const { name, email, phone, user_type, age, company_name, company_field } = userData;
        const query = `
            INSERT INTO users (name, email, phone, password, user_type, age, company_name, company_field) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [name, email, phone, password, user_type, age, company_name, company_field];
        const [result] = await connection.execute(query, values);

        return { userId: result.insertId, };
    } catch (error) {
        console.error("Error creating business user:", error.message);
        throw new Error("Failed to create business");
    }
};

// User login function
const userLogin = async (userData) => {
    try {
        const connection = await getConnection();
        const { email, password } = userData;
        const query = `SELECT id, password,status FROM users WHERE email = ?`;
        const [rows] = await connection.execute(query, [email]);

        if (rows.length === 0) {
            return { status: 0, message: 'User not found ' };
        }

        const { id, password: hashedPassword, status } = rows[0];
        const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

        if (!isPasswordMatch) {
            return { status: 0, message: 'Invalid credentials' };
        }
        if (status != 'active') {
            return { status: 0, message: 'User is not active' }
        }

        const token = await generateAccessToken(id);
        const updateQuery = `UPDATE users SET access_token = ? WHERE id = ?`;
        const [updateResult] = await connection.execute(updateQuery, [token, id]);

        if (updateResult.affectedRows === 0) {
            return { status: 0, message: 'Failed to update access token' };
        }

        return { status: 1, message: 'Login successful', accessToken: token };
    } catch (error) {
        console.error('Error during user login:', error.message);
        return { status: 0, message: 'Failed to log in' };
    }
};

// Fetch a user by ID
const fetchUser = async (id) => {
    try {
        const connection = await getConnection();
        const query = 'SELECT * FROM users WHERE id = ?';
        const [rows] = await connection.execute(query, [id]);

        return { status: 1, data: rows, message: 'successful' };
    } catch (error) {
        console.error("Error fetching user:", error.message);
        return { status: 0, message: 'Failed to fetch user' };
    }
};

// Update student data by ID
const updateStudentData = async (id, name) => {
    try {
        const connection = await getConnection();
        if (!id) {
            return { status: 0, message: "no id found" };
        }

        const query = 'UPDATE users SET name = ? WHERE id = ?';
        const [rows] = await connection.execute(query, [name, id]);

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

export default { getConnection, getAllUsers, generateAccessToken, createStudent, createBusiness, userLogin, fetchUser, updateStudentData };
