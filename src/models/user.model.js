import connectDB from '../db/index.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const getConnection = async () => {
    try {
        return await connectDB();
    } catch (error) {
        console.error("Error establishing database connection:", error.message);
        throw new Error("Database connection failed");
    }
};

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

const createStudent = async (userData) => {
    try {
        const connection = await getConnection();
        const password = await bcrypt.hash(userData.password, 10);

        const { name, email, phone, user_type, college_name, field_of_study, graduation_year, proof } = userData;
        const query = `
            INSERT INTO users (name, email, phone, password, user_type, college_name, field_of_study, graduation_year, proof) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [name, email, phone, password, user_type, college_name, field_of_study, graduation_year, proof];
        const [result] = await connection.execute(query, values);

        return { userId: result.insertId, ...userData, password: undefined };
    } catch (error) {
        console.error("Error creating student user:", error.message);
        throw new Error("Failed to create student");
    }
};

const createBusiness = async (userData) => {
    try {
        const connection = await getConnection();
        const password = await bcrypt.hash(userData.password, 10);

        const { name, email, phone, user_type, company_name, company_field } = userData;
        const query = `
            INSERT INTO users (name, email, phone, password, user_type, company_name, company_field) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [name, email, phone, password, user_type, company_name, company_field];
        const [result] = await connection.execute(query, values);

        return { userId: result.insertId, ...userData, password: undefined };
    } catch (error) {
        console.error("Error creating business user:", error.message);
        throw new Error("Failed to create business");
    }
};

const userLogin = async (userData) => {
    try {
        const connection = await getConnection();
        const { email, password } = userData;

        // Query to fetch the user by email
        const query = `SELECT id, password FROM users WHERE email = ?`;
        const [rows] = await connection.execute(query, [email]);

        if (rows.length === 0) {
            return { status: 0, message: 'User not found' };
        }

        const { id, password: hashedPassword } = rows[0];

        // Compare the provided password with the hashed password in the database
        const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

        if (!isPasswordMatch) {
            return { status: 0, message: 'Invalid credentials' };
        }

        // Generate access token
        const token = await generateAccessToken(id);

        // Update the database with the access token
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

export default { getConnection, getAllUsers, createStudent, createBusiness, userLogin };
