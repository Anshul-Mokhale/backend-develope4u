import express from 'express';
import { getUsers, addUser, userLogin } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/get-user', getUsers);
router.post('/add-user', addUser);
router.post('/user-login', userLogin);

export default router;
