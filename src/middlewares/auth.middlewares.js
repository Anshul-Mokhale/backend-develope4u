import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import User from '../models/user.model.js';

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Extract the token from the Authorization header
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Decode the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // console.log('Decoded Token:', decodedToken);

        // Extract only the id from the token
        const userId = decodedToken?.id;

        if (!userId) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // Fetch the user using the id
        const user = await User.fetchUser(userId);

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // Attach the user to the request object
        req.user = user;

        // Proceed to the next middleware
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Access token expired, Please log in");
        }
        throw new ApiError(401, error?.message || "Invalid access token");
    }
    
});
