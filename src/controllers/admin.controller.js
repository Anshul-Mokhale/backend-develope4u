import { json } from 'express';
import Admin from '../models/admin.model.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const adminLogin = asyncHandler(async (req, res) => {
    try {
        const loggedIn = await Admin.adminLogin(req.body);
        const options = {
            httpOnly: true,
            secure: false
        }
        if (loggedIn.status == 1) {
            return res
                .status(200)
                .cookie("accessToken", loggedIn.accessToken, options)
                .json(new ApiResponse(200, { accessToken: loggedIn.accessToken }, "User Logged In Successfully"));

        } else {
            return res
                .status(400)
                .json(400, { message: loggedIn.message })
        }
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        return next(new ApiError(500, error.message || "Failed to create user"));
    }

})
// fetching all data counts for showing in dashboard
const fetchData = asyncHandler(async (req, res) => {
    try {
        const id = req.user;
        if (!id) {
            return res.status(404).json(404, "User verification failed");
        }
        const data = await Admin.fetchData();
        if (data.status == 1) {
            return res.status(200).json(new ApiResponse(200, data.data, "Data fetched successfully"));
        } else {
            return res.status(400).json(400, { message: data.message });
        }
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        return next(new ApiError(500, error.message || "Failed to create user"));
    }
});

// Users Management
const changeStatus = asyncHandler(async (req, res) => {
    try {
        const id = req.user;
        if (!id) {
            return res.status(404).json(404, "User verification failed");
        }
        const { userId, status } = req.body;
        const data = await Admin.changeStatus(userId, status);
        if (data.status == 1) {
            return res.status(200).json(new ApiResponse(200, data.data, "Status Changed Successfully"));
        } else {
            return res.status(400).json(400, { message: data.message });
        }
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        return next(new ApiError(500, error.message || "Failed to create user"));
    }
});

const fetchUsers = asyncHandler(async (req, res) => {
    try {
        const id = req.user;
        if (!id) {
            return res.status(404).json(404, "Admin verification failed");
        }
        const { userId } = req.body;
        const data = await Admin.fetchUsers(userId);
        if (data.status == 1) {
            return res.status(200).json(new ApiResponse(200, data.data, "Data fetched successfully"));
        } else {
            return res.status(400).json(400, { message: data.message });
        }
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        return next(new ApiError(500, error.message || "Failed to create user"));
    }
});

const fetchUserList = asyncHandler(async (req, res) => {
    try {
        const id = req.user;
        if (!id) {
            return res.status(404).json(404, "Admin verification failed");
        }
        const data = await Admin.fetchUserList();
        if (data.status == 1) {
            return res.status(200).json(new ApiResponse(200, data.data, "Data fetched successfully"));
        } else {
            return res.status(400).json(400, { message: data.message });
        }

    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        return next(new ApiError(500, error.message || "Failed to create user"));
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    try {
        const id = req.user;
        if (!id) {
            return res.status(404).json(404, "Admin verification failed");
        }
        const { userId } = req.body;
        const data = await Admin.deleteUser(userId);
        if (data.status == 1) {
            return res.status(200).json(new ApiResponse(200, data.data, "User Deleted Successfully"));
        } else {
            return res.status(400).json(400, { message: data.message });
        }
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        return next(new ApiError(500, error.message || "Failed to create user"));
    }
});

// Business management
const changeBusinessStatus = asyncHandler(async (req, res) => {
    try {
        const id = req.user;
        if (!id) {
            return res.status(404).json(404, "User verification failed");
        }
        const { userId, status } = req.body;
        const data = await Admin.changeStatus(userId, status);
        if (data.status == 1) {
            return res.status(200).json(new ApiResponse(200, data.data, "Status Changed Successfully"));
        } else {
            return res.status(400).json(400, { message: data.message });
        }
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        return next(new ApiError(500, error.message || "Failed to create user"));
    }
});

const fetchBusiness = asyncHandler(async (req, res) => {
    try {
        const id = req.user;
        if (!id) {
            return res.status(404).json(404, "Admin verification failed");
        }
        const { userId } = req.body;
        const data = await Admin.fetchUsers(userId);
        if (data.status == 1) {
            return res.status(200).json(new ApiResponse(200, data.data, "Data fetched successfully"));
        } else {
            return res.status(400).json(400, { message: data.message });
        }
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        return next(new ApiError(500, error.message || "Failed to create user"));
    }
});

const fetchBusinessList = asyncHandler(async (req, res) => {
    try {
        const id = req.user;
        if (!id) {
            return res.status(404).json(404, "Admin verification failed");
        }
        const data = await Admin.fetchUserList();
        if (data.status == 1) {
            return res.status(200).json(new ApiResponse(200, data.data, "Data fetched successfully"));
        } else {
            return res.status(400).json(400, { message: data.message });
        }

    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        return next(new ApiError(500, error.message || "Failed to create user"));
    }
});

const deleteBusiness = asyncHandler(async (req, res) => {
    try {
        const id = req.user;
        if (!id) {
            return res.status(404).json(404, "Admin verification failed");
        }
        const { userId } = req.body;
        const data = await Admin.deleteUser(userId);
        if (data.status == 1) {
            return res.status(200).json(new ApiResponse(200, data.data, "Business Deleted Successfully"));
        } else {
            return res.status(400).json(400, { message: data.message });
        }
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        return next(new ApiError(500, error.message || "Failed to create user"));
    }
});
// Project management
const createProject = asyncHandler(async (req, res) => {
    try {

        const id = req.user;
        if (!id) {
            return res.status(404).json(404, "Admin verification failed");
        }
        const { title, description, category } = req.body;

        const thumbnail = `http://localhost:3000/uploads/${req.files.thumbnail[0].filename}`;
        const screenshot = req.files.screenshot.map((file) => `http://localhost:3000/uploads/${file.filename}`);

        const projectData = { title, description, category, thumbnail, screenshot };

        const data = await Admin.createProject(projectData);
        if (data.status == 1) {
            return res.status(200).json(new ApiResponse(200, data.projectId, "Project Created Successfully"));
        } else {
            return res.status(400).json(400, { message: data.message });
        }
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        return next(new ApiError(500, error.message || "Failed to create Project"));
    }
});

const fetchProjectList = asyncHandler(async (req, res) => {
    try {
        const id = req.user;
        if (!id) {
            return res.status(404).json(404, "Admin verification failed");
        }
        const data = await Admin.fetchProjectList();
        if (data.status == 1) {
            return res.status(200).json(new ApiResponse(200, data.data, "Data fetched successfully"));
        } else {
            return res.status(400).json(400, { message: data.message });
        }
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        return next(new ApiError(500, error.message || "Failed to fetch Project"));
    }
});

const fetchProjectDetails = asyncHandler(async (req, res) => {
    try {
        const id = req.user;
        if (!id) {
            return res.status(404).json(404, "Admin verification failed");
        }
        const { projectId } = req.body;
        const data = await Admin.fetchProjectDetails(projectId);
        if (data.status == 1) {
            return res.status(200).json(new ApiResponse(200, data.data, "Data fetched successfully"));
        } else {
            return res.status(400).json(400, { message: data.message });
        }
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        return next(new ApiError(500, error.message || "Failed to fetch Project"));
    }
});

const updateProject = asyncHandler(async (req, res) => {
    try {
        const id = req.user;
        if (!id) {
            return res.status(404).json(404, "Admin verification failed");
        }
        const { projectId, title, description, category } = req.body;
        const projectData = { title, description, category };
        const data = await Admin.updateProjectDetails(projectId, projectData);
        if (data.status == 1) {
            return res.status(200).json(new ApiResponse(200, data.data, "Project Updated Successfully"));
        } else {
            return res.status(400).json(400, { message: data.message });
        }
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        return next(new ApiError(500, error.message || "Failed to update Project"));
    }
});

const updateThumbnail = asyncHandler(async (req, res) => {
    try {
        const id = req.user;
        if (!id) {
            return res.status(404).json(404, "Admin verification failed");
        }
        const { projectId } = req.body;
        const thumbnail = `http://localhost:3000/uploads/${req.file.filename}`;
        const data = await Admin.updateThumbnail(projectId, thumbnail);
        if (data.status == 1) {
            return res.status(200).json(new ApiResponse(200, data.data, "Thumbnail Updated Successfully"));
        } else {
            return res.status(400).json(400, { message: data.message });
        }
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        return next(new ApiError(500, error.message || "Failed to update Thumbnail"));
    }
});

const updateScreenshot = asyncHandler(async (req, res) => {
    try {
        const id = req.user;
        if (!id) {
            return res.status(404).json(404, "Admin verification failed");
        }
        const { projectId } = req.body;
        const screenshot = req.files.map((file) => `http://localhost:3000/uploads/${file.filename}`);
        const data = await Admin.updateScreenshot(projectId, screenshot);
        if (data.status == 1) {
            return res.status(200).json(new ApiResponse(200, data.data, "Screenshot Updated Successfully"));
        } else {
            return res.status(400).json(400, { message: data.message });
        }
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        return next(new ApiError(500, error.message || "Failed to update Screenshot"));
    }
});

const deleteProject = asyncHandler(async (req, res) => {
    try {
        const id = req.user;
        if (!id) {
            return res.status(404).json(404, "Admin verification failed");
        }
        const { projectId } = req.body;
        const data = await Admin.deleteProject(projectId);
        if (data.status == 1) {
            return res.status(200).json(new ApiResponse(200, data.data, "Project Deleted Successfully"));
        } else {
            return res.status(400).json(400, { message: data.message });
        }
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        return next(new ApiError(500, error.message || "Failed to delete Project"));
    }
});

export {
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
    updateProject,
    updateThumbnail,
    updateScreenshot,
    deleteProject
};