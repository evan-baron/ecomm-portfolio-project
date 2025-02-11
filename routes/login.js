import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../db.js';  // Import the database connection

const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = result.rows[0];

        // Compare the provided password with the stored hashed password
        const matchedPassword = await bcrypt.compare(password, user.password);

        if (!matchedPassword) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // User authenticated
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
