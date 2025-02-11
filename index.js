import express from 'express';
import pool from './db.js'; // Import the PostgreSQL connection pool
import loginRoute from './routes/login.js'; // Import login route
import registerRoute from './routes/register.js'; // Import register route
import recoveryRoute from './routes/recover.js'; // Import recovery route

const app = express();
const port = 3000;

// Middleware
app.use(express.json()); // Built-in JSON parser
app.use(express.urlencoded({ extended: true })); // Built-in URL parser

// Routes
app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/recover', recoveryRoute);

app.get('/', (req, res) => {
    res.json({ info: 'Node.js, Express, and Postgres API' });
});

// Start the server
app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
