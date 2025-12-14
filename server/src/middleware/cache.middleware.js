const cacheService = require('../services/cache.service');
const { logger } = require('../utils/logger');

const cacheMiddleware = (ttl) => (req, res, next) => {
    if (req.method !== 'GET') {
        return next();
    }

    const key = req.originalUrl;
    const cachedResponse = cacheService.get(key);

    if (cachedResponse) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(cachedResponse);
    }

    res.setHeader('X-Cache', 'MISS');
    res.setHeader('X-Cache-TTL', ttl);

    const originalJson = res.json;
    res.json = function (body) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            cacheService.set(key, body, ttl);
        }
        originalJson.call(this, body);
    };

    next();
};

const invalidateCache = (...patterns) => (req, res, next) => {
    const originalJson = res.json;
    res.json = function (body) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            patterns.forEach((pattern) => cacheService.invalidatePattern(pattern));
        }
        originalJson.call(this, body);
    };
    next();
};

const cacheIf = (conditionFn, ttl) => (req, res, next) => {
    if (conditionFn(req)) {
        return cacheMiddleware(ttl)(req, res, next);
    }
    next();
};

const noCache = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
};

module.exports = {
    cacheMiddleware,
    invalidateCache,
    cacheIf,
    noCache,
};
