import express from 'express';
import { getUsers, addUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/get-user', getUsers);
router.post('/add-user', addUser);

export default router;
