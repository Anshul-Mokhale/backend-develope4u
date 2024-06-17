import { Router, response } from 'express';

import { createPost, updateImage, updateDetails } from '../controllers/recipe.controller.js';
import { upload } from '../middlewares/multer.middlewares.js';

const router = Router();

router.route('/create-post').post(
    upload.single('recipeImage'),
    createPost
);



router.route('/update-image').post(
    upload.single('updatedImage'),
    updateImage
)
router.route('/update-details').post(
    updateDetails
)

export default router;