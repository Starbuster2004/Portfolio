const express = require('express');
const router = express.Router();
const {
    getProjects,
    getSingleProject,
    createProject,
    updateProject,
    deleteProject,
} = require('../controllers/project.controller');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { validateBody, validateParams } = require('../middleware/validate.middleware');
const { projectSchema, projectUpdateSchema, idParamSchema } = require('../schemas/validation.schemas');
const { cacheMiddleware, invalidateCache } = require('../middleware/cache.middleware');
const { uploadProjectImage } = require('../middleware/upload.middleware');
const { CACHE_KEYS, CACHE_TTL } = require('../utils/constants');
const { uploadRateLimitMiddleware } = require('../middleware/rateLimit.middleware');

router
    .route('/')
    .get(cacheMiddleware(CACHE_TTL.LONG), getProjects)
    .post(
        protect,
        authorizeRoles('admin'),
        uploadRateLimitMiddleware,
        uploadProjectImage.single('image'),
        validateBody(projectSchema),
        invalidateCache(CACHE_KEYS.PROJECTS),
        createProject
    );

router
    .route('/:id')
    .get(
        validateParams(idParamSchema),
        cacheMiddleware(CACHE_TTL.LONG),
        getSingleProject
    )
    .put(
        protect,
        authorizeRoles('admin'),
        validateParams(idParamSchema),
        uploadRateLimitMiddleware,
        uploadProjectImage.single('image'),
        validateBody(projectUpdateSchema),
        invalidateCache(CACHE_KEYS.PROJECTS),
        updateProject
    )
    .delete(
        protect,
        authorizeRoles('admin'),
        validateParams(idParamSchema),
        invalidateCache(CACHE_KEYS.PROJECTS),
        deleteProject
    );

module.exports = router;
