import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        avatar: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        savedRecipe: [
            {
                type: Schema.Types.ObjectId,
                ref: "Recipe"
            }
        ],
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            phone: this.phone,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

// Method to add a recipe to saved recipes
userSchema.methods.addRecipe = async function (recipeId) {
    if (!this.savedRecipe.includes(recipeId)) {
        this.savedRecipe.push(recipeId);
        await this.save();
    }
}

// Method to get all saved recipes
userSchema.methods.getSavedRecipes = async function () {
    const recipes = await mongoose.model('Recipe').find({ _id: { $in: this.savedRecipe } });
    return recipes;
}

export const User = mongoose.model("User", userSchema);
