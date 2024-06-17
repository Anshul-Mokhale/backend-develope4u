import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN || "http://cook-up.netlify.app",
    credentials: true
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions)); // Handle preflight requests

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN); // Log to verify the value

// routes import
import userRouter from './routes/user.routes.js';
import recipeRouter from './routes/recipe.routes.js';

app.use("/api/v1/users", userRouter);
app.use("/api/v1/recipe", recipeRouter);

export { app };
