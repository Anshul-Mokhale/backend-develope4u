import express from 'express';
import {
    fetchProjects,
    fetchProjectById
} from '../controllers/website.controller.js';

const router = express.Router();

router.route('/fetch-projects').get(fetchProjects);
router.route('/fetch-project-by-id').get(fetchProjectById);

export default router;