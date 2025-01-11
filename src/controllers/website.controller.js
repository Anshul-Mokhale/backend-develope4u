import { json } from 'express';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Website from "../models/website.model.js";


const fetchProjects = asyncHandler(async (req, res, next) => {
    try {
        const projects = await Website.fetchProjects();
        if (projects.status === 0) {
            return res
                .status(404)
                .json({ status: 404, message: projects.message });
        }

        res.status(200).json(new ApiResponse(200, projects.data, "Project fetch Successfully"));
    } catch (error) {
        next(new ApiError(error.message, 500));
    }
});

const fetchProjectById = asyncHandler(async (req, res, next) => {
    try {
        const { projectId } = req.body;
        const project = await Website.fetchProjectById(projectId);
        if (project.status === 0) {
            return res
                .status(404)
                .json({ status: 404, message: project.message });
        }

        return res
            .status(200)
            .json(new ApiResponse(200, project.data, "Project fetch Successfully"));
    } catch (error) {
        next(new ApiError(error.message, 500));
    }
});

export {
    fetchProjects,
    fetchProjectById
}