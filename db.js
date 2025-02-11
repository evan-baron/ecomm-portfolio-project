import pkg from 'pg';
const { Pool } = pkg;

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
        process.exit(1);
    });

export default pool; // Export the pool for use in other files
