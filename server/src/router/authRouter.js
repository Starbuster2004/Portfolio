const express = require('express');
const router = express.Router();
const { login, logout, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validate.middleware');
const { loginSchema } = require('../schemas/validation.schemas');
const { authRateLimitMiddleware } = require('../middleware/rateLimit.middleware');

router.post('/login', authRateLimitMiddleware, validateBody(loginSchema), login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
