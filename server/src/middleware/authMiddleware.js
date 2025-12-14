const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
// Assuming User model exists or will exist. If not, this might fail.
// I'll assume standard User model path or update later.
// The prompt implies User model exists in `server/src/models/user/`.
// But current structure has models in `src/models`.
// I will try to require from `../models/User` (if I create it) or just `../models/User` if it exists.
// Since User model doesn't exist yet in my view, I should probably create it or stub it.
// Wait, the user prompt says "Keep existing models". But I didn't see a User model.
// I will assume I need to create it or it's missing.
// For now, I will require `../models/User` and if it fails I'll fix it.
// Actually, to be safe, I'll check if User model exists.
// Previous `list_dir src/models` showed `Blog.js`, `Contact.js`, `HomeData.js`, `Project.js`. No User.js.
// I will create a User model stub in Phase 7 or now.
// I'll write the middleware assuming User model will be available.

const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next(ApiError.unauthorized('Not authorized to access this route'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password').lean();

        if (!req.user) {
            return next(ApiError.unauthorized('User not found'));
        }

        next();
    } catch (err) {
        return next(ApiError.unauthorized('Not authorized to access this route'));
    }
});

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                ApiError.forbidden(
                    `User role ${req.user.role} is not authorized to access this route`
                )
            );
        }
        next();
    };
};

const optionalAuth = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password').lean();
        next();
    } catch (err) {
        // If token is invalid, just continue without user
        next();
    }
});

module.exports = { protect, authorizeRoles, optionalAuth };
