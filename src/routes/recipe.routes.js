import { Router, response } from 'express';

import { createPost, updateImage, updateDetails, getAllPost, getUserPost, viewRecipe, getSavedPosts, saveRecipe, unsaveRecipe, deletePost, searchRecipes } from '../controllers/recipe.controller.js';
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
router.route('/get-saved-recipes').post(
    verifyJWT,
    getSavedPosts
)

router.route('/save-recipe').post(
    saveRecipe
)
router.route('/remove-recipe').post(
    unsaveRecipe
)

router.route('/delete-recipe').post(
    deletePost
)

router.route('/search-recipes').get(
    searchRecipes
)
export default router;