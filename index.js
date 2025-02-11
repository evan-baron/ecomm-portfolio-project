import express from 'express';
import pool from './db.js'; // Import the PostgreSQL connection pool
import loginRoute from './routes/login.js'; // Import login route
import registerRoute from './routes/register.js'; // Import register route
import recoveryRoute from './routes/recover.js'; // Import recovery route
import cookieParser from 'cookie-parser'; // Import cookie-parser for handling cookies
import jwt from 'jsonwebtoken'; // Import JWT for token generation and verification

const app = express();
const port = 3000;

// Middleware
app.use(express.json()); // Built-in JSON parser
app.use(express.urlencoded({ extended: true })); // Built-in URL parser
app.use(cookieParser());  // Add cookie-parser middleware to handle cookies

// Token verification middleware
const verifyToken = (req, res, next) => {
    const token = req.cookies.auth_token;  // Access token from cookies

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        req.userId = decoded.userId;  // Attach user ID to request object
        next();
    });
};

// Routes
app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/recover', recoveryRoute);

// Example protected route (you can add more as needed)
app.get('/profile', verifyToken, async (req, res) => {
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.userId]);
    res.json(user.rows[0]);
});

app.get('/', (req, res) => {
    res.json({ info: 'Node.js, Express, and Postgres API' });
});

// Start the server
app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
