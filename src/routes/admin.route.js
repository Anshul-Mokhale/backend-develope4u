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
    deleteBusiness
} from '../controllers/admin.controller.js';


const router = express.Router();

router.route('/admin-login').post(adminLogin);
router.route('/fetch-data').get(verifyJWT, fetchData);
// user management
router.route('/change-status').post(verifyJWT, changeStatus);
router.route('/fetch-user').post(verifyJWT, fetchUsers);
router.route('/fetch-user-list').get(verifyJWT, fetchUserList);
router.route('/delete-user').post(verifyJWT, deleteUser);
// admin management
router.route('/change-business-status').post(verifyJWT, changeBusinessStatus);
router.route('/fetch-business').get(verifyJWT, fetchBusiness);
router.route('/fetch-business-list').get(verifyJWT, fetchBusinessList);
router.route('/delete-business').post(verifyJWT, deleteBusiness);

export default router;