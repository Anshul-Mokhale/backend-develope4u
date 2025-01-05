// Import environment variables first
import dotenv from 'dotenv';
dotenv.config();  // Load .env file variables

// Import necessary modules
import connectDB from './db/index.js';  // Assuming db.js is in the config folder
import { app } from './app.js';  // Express app instance

// Get the port from environment variables or default to 8000
const PORT = process.env.PORT || 8000;

// Connect to MySQL database
connectDB()
    .then(() => {
        // Start the Express server if the connection is successful
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        // Log and terminate the application if the connection fails
        console.error('MySQL Connection failed:', err);
        process.exit(1);  // Exit the process with failure
    });
