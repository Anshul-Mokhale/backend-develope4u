import User from '../models/user.model.js';
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";

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
        const { user_type } = req.body;

        if (!user_type) {
            return res.status(400).json({ status: 400, message: "No User type found!" });
        }

        let insertedUser;
        
        if (user_type == 'student') {
            insertedUser = await User.createStudent(req.body);
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

const userLogin = async(req,res)=>{
    try{
        // const {email,passowrd} = req.body;
        const loggedIn = await User.userLogin(req.body);
        const options = {
            httpOnly: true,
            secure: false
        }
        if(loggedIn.status==1){
            return res
            .status(200)
            .cookie("accessToken", loggedIn.accessToken, options)
            .json(new ApiResponse(200, { accessToken: loggedIn.accessToken }, "User Logged In Successfully"));
          
        }else{
            return res
            .status(400)
            .json(400,{message:"user logged in failed"})
        }
    }catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        return next(new ApiError(500, error.message || "Failed to create user"));
    }
}

export { getUsers, addUser, userLogin };
