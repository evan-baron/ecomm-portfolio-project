import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../db.js';  // Import the database connection

const router = express.Router();

router.post('/', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user into the database
        const result = await pool.query(
            'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [first_name, last_name, email, hashedPassword]
        );

        // Send back a response (without sending the password!)
        res.json({
            message: 'User registered successfully',
            user: {
                id: result.rows[0].id,
                first_name: result.rows[0].first_name,
                last_name: result.rows[0].last_name,
                email: result.rows[0].email,
            },
        });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
