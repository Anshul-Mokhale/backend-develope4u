import connectDB from '../db/index.js';
import User from "./user.model.js";
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

// Project Management

const createProject = async (projectData) => {
    try {
        const connection = await getConnection();
        const { title, description, thumbnail, screenshot, category } = projectData;
        const query = `INSERT INTO projects (title, description, thumbnail, screenshot, category) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await connection.execute(query, [title, description, thumbnail, screenshot, category]);

        if (result.affectedRows === 0) {
            return { status: 0, message: 'Failed to create project' };
        }

        return { status: 1, projectId: result.insertId };


    } catch (error) {
        console.error("Error creating project:", error.message);
        throw new Error("Failed to create project");
    }
}

const fetchProjectList = async () => {
    try {
        const connection = await getConnection();
        const query = `SELECT id,title,category,created_at,updated_at FROM projects`;
        const [rows] = await connection.execute(query);

        if (rows.length === 0) {
            return { status: 0, message: 'No projects found' };
        }

        return { status: 1, data: rows };
    }
    catch (error) {
        console.error("Error fetching project:", error.message);
        throw new Error("Failed to fetch project");
    }
}

const fetchProjectDetails = async (projectId) => {
    try {
        const connection = await getConnection();
        const query = `SELECT * FROM projects WHERE id = ?`;
        const [rows] = await connection.execute(query, [projectId]);

        if (rows.length === 0) {
            return { status: 0, message: 'Project not found' };
        }

        return { status: 1, data: rows[0] };
    } catch (error) {
        console.error("Error fetching project details:", error.message);
        throw new Error("Failed to fetch project details");
    }
}

const updateProjectDetails = async (projectId, projectData) => {
    try {
        const connection = await getConnection();
        const { title, description, category } = projectData;
        const query = `UPDATE projects SET title = ?, description = ?, category = ? WHERE id = ?`;
        const [rows] = await connection.execute(query, [title, description, category, projectId]);

        if (rows.affectedRows === 0) {
            return { status: 0, message: 'Failed to update project' };
        }

        return { status: 1, message: 'Project updated successfully' };
    } catch (error) {
        console.error("Error updating project:", error.message);
        throw new Error("Failed to update project");
    }
}

const updateThumbnail = async (projectId, thumbnail) => {
    try {
        const connection = await getConnection();
        const query = `UPDATE projects SET thumbnail = ? WHERE id = ?`;
        const [rows] = await connection.execute(query, [thumbnail, projectId]);

        if (rows.affectedRows === 0) {
            return { status: 0, message: 'Failed to update thumbnail' };
        }

        return { status: 1, message: 'Thumbnail updated successfully' };
    } catch (error) {
        console.error("Error updating thumbnail:", error.message);
        throw new Error("Failed to update thumbnail");
    }
}

const updateScreenshot = async (projectId, screenshot) => {
    try {
        const connection = await getConnection();
        const query = `UPDATE projects SET screenshot = ? WHERE id = ?`;
        const [rows] = await connection.execute(query, [screenshot, projectId]);

        if (rows.affectedRows === 0) {
            return { status: 0, message: 'Failed to update screenshot' };
        }

        return { status: 1, message: 'Screenshot updated successfully' };
    } catch (error) {
        console.error("Error updating screenshot:", error.message);
        throw new Error("Failed to update screenshot");
    }
}

const deleteProject = async (projectId) => {
    try {
        const connection = await getConnection();
        const query = `DELETE FROM projects WHERE id = ?`;
        const [rows] = await connection.execute(query, [projectId]);

        if (rows.affectedRows === 0) {
            return { status: 0, message: 'Failed to delete project' };
        }
        return { status: 1, message: 'Project deleted successfully' };
    } catch (error) {
        console.error("Error deleting project:", error.message);
        throw new Error("Failed to delete project");
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
    createProject,
    fetchProjectList,
    fetchProjectDetails,
    updateProjectDetails,
    updateThumbnail,
    updateScreenshot,
    deleteProject
};