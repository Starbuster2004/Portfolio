const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const cacheService = require('../services/cache.service');
const ApiResponse = require('../utils/apiResponse');

/**
 * @desc    Flush all caches
 * @route   POST /api/admin/cache/flush
 * @access  Private (Admin)
 */
router.post('/cache/flush', protect, authorizeRoles('admin'), (req, res) => {
    cacheService.flush();
    res.json(ApiResponse.ok({ message: 'All caches cleared' }));
});

/**
 * @desc    Get cache stats
 * @route   GET /api/admin/cache/stats
 * @access  Private (Admin)
 */
router.get('/cache/stats', protect, authorizeRoles('admin'), (req, res) => {
    const stats = cacheService.getStats();
    res.json(ApiResponse.ok(stats));
});

/**
 * @desc    Health check / Keep alive
 * @route   GET /api/admin/health
 * @access  Public
 */
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});

module.exports = router;
