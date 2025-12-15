const express = require('express');
const router = express.Router();
const {
    getExperiences,
    getExperiencesAdmin,
    getExperience,
    createExperience,
    updateExperience,
    deleteExperience,
    reorderExperiences,
} = require('../controllers/experience.controller');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { cacheMiddleware } = require('../middleware/cache.middleware');
const { CACHE_TTL } = require('../utils/constants');

// Public routes (with caching)
router.get('/', cacheMiddleware(CACHE_TTL.SHORT), getExperiences);
router.get('/:id', cacheMiddleware(CACHE_TTL.SHORT), getExperience);

// Admin routes (no caching)
router.get('/admin/all', protect, authorizeRoles('admin'), getExperiencesAdmin);
router.post('/', protect, authorizeRoles('admin'), createExperience);
router.put('/reorder', protect, authorizeRoles('admin'), reorderExperiences);
router.put('/:id', protect, authorizeRoles('admin'), updateExperience);
router.delete('/:id', protect, authorizeRoles('admin'), deleteExperience);

module.exports = router;

