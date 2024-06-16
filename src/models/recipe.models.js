import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const recipeSchema = new Schema(
    {
        recipeImage: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        ingredient: {
            type: String,
            required: true,
        },
        steps: {
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        category: {
            type: String,
            required: true,
        }

    },
    {
        timestamps: true,
    }
)

recipeSchema.plugin(mongooseAggregatePaginate)

export const Recipe = mongoose.model("Recipe", recipeSchema)