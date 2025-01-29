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
    createProject,
    fetchProjectList,
    fetchProjectDetails,
    updateProjectDetails,
    updateThumbnail,
    updateScreenshot,
    deleteProject
}