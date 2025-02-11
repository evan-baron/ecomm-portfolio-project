import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    const { email } = req.body;
    res.json({ message: 'Recover route hit', email });
});

export default router;
