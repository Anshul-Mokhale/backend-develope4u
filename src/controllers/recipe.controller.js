import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Recipe } from "../models/recipe.models.js";
import { User } from "../models/user.models.js"; // Make sure to import User model
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPost = asyncHandler(async (req, res) => {
    const { title, description, ingredient, steps, category } = req.body;

    if (
        [title, description, ingredient, steps, category].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const recipeImagePath = req.file?.path;

    if (!recipeImagePath) {
        throw new ApiError(400, "Recipe image file is required");
    }

    const recipeImage = await uploadOnCloudinary(recipeImagePath);

    if (!recipeImage) {
        throw new ApiError(400, "Error uploading recipe image");
    }

    const recipe = await Recipe.create({
        recipeImage: recipeImage.url, // Assuming the uploadOnCloudinary function returns an object with a url property
        title,
        description,
        ingredient,
        steps,
        userId: user._id, // Assign the user's ID to userId
        category
    });

    const createdRecipe = await Recipe.findById(recipe._id).select(
        "-description -ingredient -steps -category"
    );

    if (!createdRecipe) {
        throw new ApiError(500, "Something went wrong while creating the recipe");
    }

    return res.status(201).json(
        new ApiResponse(201, createdRecipe, "Recipe created successfully")
    );
});

const updateImage = asyncHandler(async (req, res) => {
    const { recipe_id } = req.body;

    // Check if the recipe_id is provided
    if (!recipe_id) {
        throw new ApiError(400, "Recipe ID is required");
    }

    // Find the recipe by ID
    let recipe = await Recipe.findById(recipe_id);
    if (!recipe) {
        throw new ApiError(404, "Recipe not found");
    }

    // Check if the updated image file exists
    const updatedImagePath = req.file?.path;
    if (!updatedImagePath) {
        throw new ApiError(400, "Recipe image file is required");
    }

    // Upload the updated image to Cloudinary
    const updatedImage = await uploadOnCloudinary(updatedImagePath);
    if (!updatedImage) {
        throw new ApiError(400, "Error uploading recipe image");
    }

    try {
        // Update the recipe's image URL with the new one
        recipe.recipeImage = updatedImage.url;
        await recipe.save();

        // If you have additional logic to update the table, do it here

        // Respond with success message
        return res.status(200).json(
            new ApiResponse(200, updatedImage, "Image updated successfully!")
        );
    } catch (error) {
        // If any error occurs during the update process, handle it
        throw new ApiError(500, "Error updating recipe image");
    }
});


const updateDetails = asyncHandler(async (req, res) => {

    const { title, description, ingredient, steps, recipe_id } = req.body;

    if (!recipe_id) {
        throw new ApiError(400, "Recipe ID is required");
    }

    // Find the recipe by ID
    let recipe = await Recipe.findById(recipe_id);
    if (!recipe) {
        throw new ApiError(404, "Recipe not found");
    }


    try {
        // Update the recipe's image URL with the new one
        recipe.title = title;
        recipe.description = description;
        recipe.ingredient = ingredient;
        recipe.steps = steps;
        await recipe.save();

        // If you have additional logic to update the table, do it here

        // Respond with success message
        return res.status(200).json(
            new ApiResponse(200, recipe, "Image updated successfully!")
        );
    } catch (error) {
        // If any error occurs during the update process, handle it
        throw new ApiError(500, "Error updating details");
    }

});

export { createPost, updateImage, updateDetails };
