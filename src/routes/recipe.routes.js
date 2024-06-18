import { Router, response } from 'express';

import { createPost, updateImage, updateDetails, getAllPost, getUserPost, viewRecipe, getSavedPosts } from '../controllers/recipe.controller.js';
import { upload } from '../middlewares/multer.middlewares.js';
import { verifyJWT } from '../middlewares/auth.middlewares.js';

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
router.route('/get-all-recipes').get(
    getAllPost
)

router.route('/get-user-post').post(
    getUserPost
)

router.route('/view-recipe').post(
    viewRecipe
)
router.route('/get-recipes').post(
    verifyJWT,
    getSavedPosts
)
export default router;