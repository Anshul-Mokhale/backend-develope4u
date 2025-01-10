import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Access token is required" });
        }

        // Decode the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Extract the user ID from the token
        const userId = decodedToken?.id;

        if (!userId) {
            return res.status(401).json({ message: "Invalid Access Token" });
        }

        // Fetch the user using the ID
        const user = await User.fetchUser(userId);

        if (!user) {
            return res.status(401).json({ message: "Invalid Access Token" });
        }

        // Attach the user to the request object
        req.user = user;

        // Proceed to the next middleware
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Access token expired, please log in" });
        }
        return res.status(401).json({ message: error.message || "Invalid access token" });
    }
});
