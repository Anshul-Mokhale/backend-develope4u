import User from '../models/user.model.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getUsers = async (req, res) => {
    try {
        const connection = await User.getConnection();
        const [rows] = await connection.execute('SELECT * FROM users');
        res.status(200).json({ users: rows });
    } catch (error) {
        res.status(500).json({ error: 'Database query failed' });
    }
};

const addUser = async (req, res, next) => {
    try {
        const { name, email, phone, user_type, college_name, field_of_study, graduation_year } = req.body;
        // console.log(req.body);

        if (!name && !email && !phone && !college_name && !field_of_study && !graduation_year) {
            return res.status(404).json({ status: 404, message: "all field are required" })
        }

        if (!user_type) {
            return res.status(400).json({ status: 400, message: "No User type found!" });
        }

        let insertedUser;

        if (user_type == 'student') {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
            // console.log(fileUrl)
            insertedUser = await User.createStudent(req.body, fileUrl);
        } else if (user_type == 'business') {
            insertedUser = await User.createBusiness(req.body);
        } else {
            return res.status(400).json({ status: 400, message: "Failed to create user" });

        }

        if (!insertedUser) {
            return res.status(401).json(401, "Failed to create user");
        }

        return res
            .status(201)
            .json(new ApiResponse(201, insertedUser, "User created successfully"));
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        return next(new ApiError(500, error.message || "Failed to create user"));
    }
};

const userLogin = async (req, res) => {
    try {
        // const {email,passowrd} = req.body;
        const loggedIn = await User.userLogin(req.body);
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
}

const getUserData = async (req, res) => {
    try {
        // Assuming req.user is populated by verifyJWT
        const user = req.user;

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // If additional data is needed, fetch or manipulate it here
        // Example: const additionalData = await SomeModel.find({ userId: user.id });

        // Send user data in the response
        res.status(200).json({
            status: 200,
            data: user.data,
            message: "User data fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching user data:", error.message);
        throw new ApiError(500, "Failed to fetch user data");
    }
};

const updateStudentData = async (req, res) => {
    try {
        // Extract the name from the request body
        const { name } = req.body;

        // Extract the user from the request
        const user = req.user;

        // Validate the user and extract the ID
        if (!user) {
            throw new ApiError(404, "User not found or unauthorized");
        }

        const userId = user.data[0].id;

        // Update the student's data in the database
        const result = await User.updateStudentData(userId, name);

        // Check if the update was successful
        if (result.status === 0) {
            return res.status(404).json({
                status: 404,
                message: "Failed to update data",
            });
        }

        // Respond with success if the update succeeded
        res.status(200).json({
            status: 200,
            message: "User data updated successfully",
        });
    } catch (error) {
        // Handle errors gracefully
        console.error("Error in updateStudentData:", error.message);
        res.status(500).json({
            status: 500,
            message: error.message || "Internal server error",
        });
    }
};

const addProjectComment = async (req, res) => {
    try {
        const id = req.user;
        if (!id) {
            return res.status(404).json(404, "Admin verification failed");
        }

        // const userName = await User.getUserName(id);
        const name = id.data[0].name;
        const { projectId, comment } = req.body;
        const data = await User.addProjectComment(projectId, comment, name);
        if (data.status == 1) {
            return res.status(200).json(new ApiResponse(200, data.data, "Comment Added Successfully"));
        } else {
            return res.status(400).json(400, { message: data.message });
        }
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        return next(new ApiError(500, error.message || "Failed to add Comment"));
    }
};


export { getUsers, addUser, userLogin, getUserData, updateStudentData, addProjectComment };
