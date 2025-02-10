const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Initialize PostgreSQL connection pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

// Test database connection
pool.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => {
        console.error('Connection error', err);
        process.exit(1); // Exit the app if the database connection fails
    });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({ info: 'Node.js, Express, and Postgres API' });
});

// Start the server
app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
