import connectDB from '../db/index.js';

// Establish a database connection
const getConnection = async () => {
    try {
        return await connectDB();
    } catch (error) {
        console.error("Error establishing database connection:", error.message);
        throw new Error("Database connection failed");
    }
};

const fetchProjects = async () => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT id,title,thumbnail,category FROM projects');
        if (rows.length === 0) {
            return { status: 0, message: "No projects found" };
        }
        return { status: 1, data: rows };
    } catch (error) {
        console.error("Error fetching all projects:", error.message);
        throw new Error("Failed to fetch projects");
    }
}

const fetchProjectById = async (id) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT * FROM projects WHERE id = ?', [id]);
        if (rows.length === 0) {
            return { status: 0, message: "No project found" };
        }
        return { status: 1, data: rows[0] };

    } catch (error) {
        console.error("Error fetching project by id:", error.message);
        throw new Error("Failed to fetch project by id");
    }
}

export default {
    fetchProjects,
    fetchProjectById
}