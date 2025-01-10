import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.route.js';
import adminRoutes from "./routes/admin.route.js";

dotenv.config(); // Load environment variables

// Create an instance of the Express app
const app = express();
app.get('/', (req, res) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Develope4u</title>
        <style>
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                background: linear-gradient(135deg, #6a11cb, #2575fc);
                color: #fff;
                overflow: hidden;
            }

            .container {
                text-align: center;
                background: rgba(0, 0, 0, 0.6);
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
                transform: translateY(-20px);
                animation: float 3s ease-in-out infinite;
            }

            h1 {
                font-size: 3rem;
                margin-bottom: 20px;
                text-transform: uppercase;
                font-weight: bold;
                letter-spacing: 2px;
                animation: slideIn 1s ease-out;
            }

            p {
                font-size: 1.3rem;
                margin-bottom: 30px;
                opacity: 0.8;
            }

            a {
                text-decoration: none;
                padding: 12px 30px;
                background: #ff6f61;
                color: #fff;
                border-radius: 50px;
                font-size: 1.1rem;
                font-weight: 600;
                letter-spacing: 1px;
                transition: background 0.4s ease, transform 0.3s ease;
            }

            a:hover {
                background: #ff3b2f;
                transform: scale(1.1);
            }

            @keyframes float {
                0%, 100% {
                    transform: translateY(-20px);
                }
                50% {
                    transform: translateY(20px);
                }
            }

            @keyframes slideIn {
                0% {
                    transform: translateY(-50px);
                    opacity: 0;
                }
                100% {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            /* Adding some responsive touch */
            @media (max-width: 600px) {
                h1 {
                    font-size: 2rem;
                }

                p {
                    font-size: 1rem;
                }

                .container {
                    padding: 30px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to Develope4u</h1>
            <p>Your one-stop destination for innovative development solutions!</p>
            <a href="https://www.develope4u.site" target="_blank">Explore More</a>
        </div>
    </body>
    </html>
    `;
    res.send(htmlContent);
});
// Middleware
app.use(bodyParser.json());  // Parse JSON request bodies

// Routes
app.use('/api/v1/user/', userRoutes);
app.use('/api/v1/admin/', adminRoutes);
app.use('/uploads', express.static('public/uploads'));

// Error handling middleware (Optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
});

// Export the app instance
export { app };
