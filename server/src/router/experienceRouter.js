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

// Public routes
router.get('/', getExperiences);
router.get('/:id', getExperience);

// Admin routes
router.get('/admin/all', protect, authorizeRoles('admin'), getExperiencesAdmin);
router.post('/', protect, authorizeRoles('admin'), createExperience);
router.put('/reorder', protect, authorizeRoles('admin'), reorderExperiences);
router.put('/:id', protect, authorizeRoles('admin'), updateExperience);
router.delete('/:id', protect, authorizeRoles('admin'), deleteExperience);

module.exports = router;
