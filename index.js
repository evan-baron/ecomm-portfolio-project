import express from 'express';
import cookieParser from 'cookie-parser'; // Import cookie-parser for handling cookies
import dotenv from 'dotenv';
import authRoute from './routes/auth.js'; // Import the auth route

dotenv.config(); // This will load the .env file

const app = express();
const port = 3000;

// Middleware
app.use(express.json()); // Built-in JSON parser
app.use(express.urlencoded({ extended: true })); // Built-in URL parser
app.use(cookieParser());  // Add cookie-parser middleware to handle cookies

// Routes
app.use('/auth', authRoute); // Auth route to handle token verification

// Example public route
app.get('/', (req, res) => {
    res.json({ info: 'Node.js, Express, and Postgres API' });
});

// Start the server
app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
