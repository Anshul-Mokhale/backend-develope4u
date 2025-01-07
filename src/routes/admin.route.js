import express from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import { adminLogin, fetchData, changeStatus } from '../controllers/admin.controller.js';


const router = express.Router();

router.route('/admin-login').post(adminLogin);
router.route('/fetch-data').get(verifyJWT, fetchData);
router.route('/change-status').post(verifyJWT, changeStatus);

export default router;