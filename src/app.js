import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.route.js';

dotenv.config(); // Load environment variables

// Create an instance of the Express app
const app = express();
app.get('/', (req, res) => {
    res.send('Hello'); 
});
// Middleware
app.use(bodyParser.json());  // Parse JSON request bodies

// Routes
app.use('/api/v1/user/', userRoutes);
// app.use('/uploads', express.static('public/uploads'));

// Error handling middleware (Optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
});

// Export the app instance
export { app };
