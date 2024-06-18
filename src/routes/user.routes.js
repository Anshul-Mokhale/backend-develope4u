import { Router } from 'express';
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    getUserName
} from '../controllers/user.controllers.js';
import { upload } from '../middlewares/multer.middlewares.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';

const router = Router();

// Make sure 'profilePic' matches the name attribute in your HTML form
router.route('/register').post(
    upload.single('avatar'), // Adjust 'profilePic' to the actual field name in the form
    registerUser
);

router.route('/login').post(loginUser);

// Secured routes
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/get-user-name').post(getUserName);
// router.route('/change-password').post(verifyJWT, changeCurrentPassword);
// router.route('/current-user').get(verifyJWT, getCurrentUser);
// router.route('/update-account').patch(verifyJWT, updateAccountDetails);
// router.route('/avatar').patch(verifyJWT, upload.single('avatar'), updateUserAvatar);

export default router;
