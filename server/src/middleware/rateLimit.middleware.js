const { RateLimiterMemory } = require('rate-limiter-flexible');
const { RATE_LIMITS } = require('../utils/constants');
const ApiError = require('../utils/apiError');
const { logger } = require('../utils/logger');

const createLimiter = (config, prefix) => {
    return new RateLimiterMemory({
        points: config.points,
        duration: config.duration,
        keyPrefix: prefix,
    });
};

const generalLimiter = createLimiter(RATE_LIMITS.GENERAL, 'general');
const authLimiter = createLimiter(RATE_LIMITS.AUTH, 'auth');
const contactLimiter = createLimiter(RATE_LIMITS.CONTACT, 'contact');
const uploadLimiter = createLimiter(RATE_LIMITS.UPLOAD, 'upload');

const rateLimitMiddleware = (limiter) => (req, res, next) => {
    const key = req.ip;

    limiter.consume(key)
        .then((rateLimiterRes) => {
            res.setHeader('Retry-After', rateLimiterRes.msBeforeNext / 1000);
            res.setHeader('X-RateLimit-Limit', limiter.points);
            res.setHeader('X-RateLimit-Remaining', rateLimiterRes.remainingPoints);
            res.setHeader('X-RateLimit-Reset', new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString());
            next();
        })
        .catch((rateLimiterRes) => {
            res.setHeader('Retry-After', rateLimiterRes.msBeforeNext / 1000);
            res.setHeader('X-RateLimit-Limit', limiter.points);
            res.setHeader('X-RateLimit-Remaining', rateLimiterRes.remainingPoints);
            res.setHeader('X-RateLimit-Reset', new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString());

            logger.warn({ ip: req.ip, url: req.originalUrl }, 'Rate limit exceeded');
            next(ApiError.tooManyRequests('Too many requests, please try again later.'));
        });
};

const skipRateLimitIf = (conditionFn) => (middleware) => (req, res, next) => {
    if (conditionFn(req)) {
        return next();
    }
    return middleware(req, res, next);
};

module.exports = {
    rateLimitMiddleware: rateLimitMiddleware(generalLimiter),
    authRateLimitMiddleware: rateLimitMiddleware(authLimiter),
    contactRateLimitMiddleware: rateLimitMiddleware(contactLimiter),
    uploadRateLimitMiddleware: rateLimitMiddleware(uploadLimiter),
    skipRateLimitIf,
};
