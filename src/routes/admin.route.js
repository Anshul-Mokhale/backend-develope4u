import express from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import {
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
} from '../controllers/admin.controller.js';
import { upload } from '../middlewares/multer.middlewares.js';



const router = express.Router();

router.route('/admin-login').post(adminLogin);
router.route('/fetch-data').get(verifyJWT, fetchData);
// user management
router.route('/change-status').post(verifyJWT, changeStatus);
router.route('/fetch-user').post(verifyJWT, fetchUsers);
router.route('/fetch-user-list').get(verifyJWT, fetchUserList);
router.route('/delete-user').post(verifyJWT, deleteUser);
// business management
router.route('/change-business-status').post(verifyJWT, changeBusinessStatus);
router.route('/fetch-business').get(verifyJWT, fetchBusiness);
router.route('/fetch-business-list').get(verifyJWT, fetchBusinessList);
router.route('/delete-business').post(verifyJWT, deleteBusiness);
// project management
router.route('/create-project').post(verifyJWT, upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'screenshot', maxCount: 5 }]), createProject);
router.route('/fetch-project-list').get(verifyJWT, fetchProjectList);
router.route('/fetch-project-details').post(verifyJWT, fetchProjectDetails);
router.route('/update-project').post(verifyJWT, updateProject);
router.route('/update-thumbnail').post(verifyJWT, upload.single('thumbnail'), updateThumbnail);
router.route('/update-screenshot').post(verifyJWT, upload.array('screenshot', 5), updateScreenshot);
router.route('/delete-project').post(verifyJWT, deleteProject);

export default router;