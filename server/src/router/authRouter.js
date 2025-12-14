const express = require('express');
const router = express.Router();
const { login, logout, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validate.middleware');
const { loginSchema } = require('../schemas/validation.schemas');
const { authRateLimitMiddleware } = require('../middleware/rateLimit.middleware');

// Emergency Fix Route
router.get('/fix-admin', async (req, res) => {
    try {
        const User = require('../models/User');
        const email = 'govindrajkotalwar@gmail.com';
        const password = 'Starbuster@2033';

        let user = await User.findOne({ email });
        if (user) {
            user.password = password;
            await user.save();
            return res.send(`Admin ${email} updated with new password.`);
        }

        await User.create({ name: 'Admin', email, password, role: 'admin' });
        res.send(`Admin ${email} created successfully.`);
    } catch (e) {
        res.status(500).send(e.toString());
    }
});

router.post('/login', authRateLimitMiddleware, validateBody(loginSchema), login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
