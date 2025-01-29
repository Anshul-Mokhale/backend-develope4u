import express from 'express';
import {
    getUsers,
    addUser,
    userLogin,
    getUserData,
    updateStudentData,
    addProjectComment,
    logoutUser
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import { upload } from '../middlewares/multer.middlewares.js'; // Import multer middleware

const router = express.Router();

// Existing routes
router.route('/get-users').get(getUsers);
router.route('/add-user').post(upload.single('image'), addUser);
router.route('/user-login').post(userLogin);
router.route('/fetch-user').post(verifyJWT, getUserData);
router.route('/update-data').post(verifyJWT, updateStudentData);
router.route('/logout').get(verifyJWT, logoutUser);

// add comment
router.route('/add-comment').post(verifyJWT, addProjectComment);


export default router;
