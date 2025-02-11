// routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Import jwt for generating tokens
import pool from '../db.js';  // Import the database connection
import { Router } from 'express';

const router = Router();

// Register endpoint
router.post('/register', async (req, res) => {
    const { email, password, first_name, last_name } = req.body;

    try {
        // Check if user already exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const result = await pool.query(
            'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, hashedPassword, first_name, last_name]
        );

        const user = result.rows[0];

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('auth_token', token, {
            httpOnly: true,         
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Strict',
            maxAge: 3600000,        
        });

        res.json({
            message: 'Registration successful',
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
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

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Strict',
            maxAge: 3600000, 
        });

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

// Token verification endpoint (optional)
router.get('/verify', (req, res) => {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        res.json({ message: 'Token is valid', userId: decoded.userId });
    });
});

export default router;
