const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const jwt = require('jsonwebtoken');
const { JWT_CONFIG } = require('../utils/constants');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    });
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user (case insensitive)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
        throw ApiError.unauthorized('Invalid credentials');
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        throw ApiError.unauthorized('Invalid credentials');
    }

    const token = generateToken(user._id);

    const options = {
        expires: new Date(Date.now() + JWT_CONFIG.COOKIE_MAX_AGE),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };

    res.status(200)
        .cookie('token', token, options)
        .json(ApiResponse.ok({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        }, 'Login successful'));
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password').lean();
    res.json(ApiResponse.ok(user));
});

/**
 * @desc    Logout user / clear cookie
 * @route   GET /api/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.json(ApiResponse.ok({}, 'User logged out'));
});
