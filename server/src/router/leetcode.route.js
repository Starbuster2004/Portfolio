const express = require('express');
const router = express.Router();
const leetCodeService = require('../services/leetcode.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const { cacheMiddleware } = require('../middleware/cache.middleware');
const { CACHE_TTL } = require('../utils/constants');

router.get(
    '/',
    cacheMiddleware(CACHE_TTL.HOUR),
    asyncHandler(async (req, res) => {
        const stats = await leetCodeService.getStats();
        res.json(ApiResponse.ok(stats));
    })
);

router.get(
    '/recent',
    cacheMiddleware(CACHE_TTL.HOUR),
    asyncHandler(async (req, res) => {
        const limit = parseInt(req.query.limit) || 10;
        const submissions = await leetCodeService.getRecentSubmissions(limit);
        res.json(ApiResponse.ok(submissions));
    })
);

module.exports = router;
