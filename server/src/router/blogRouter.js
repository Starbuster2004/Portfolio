const express = require('express');
const router = express.Router();
const {
    getBlogs,
    getSingleBlog,
    createBlog,
    updateBlog,
    deleteBlog,
} = require('../controllers/blog.controller');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { validateBody, validateParams } = require('../middleware/validate.middleware');
const { blogSchema, blogUpdateSchema, idParamSchema } = require('../schemas/validation.schemas');
const { cacheMiddleware, invalidateCache } = require('../middleware/cache.middleware');
const { uploadBlogImage } = require('../middleware/upload.middleware');
const { CACHE_KEYS, CACHE_TTL } = require('../utils/constants');
const { uploadRateLimitMiddleware } = require('../middleware/rateLimit.middleware');

router
    .route('/')
    .get(cacheMiddleware(CACHE_TTL.LONG), getBlogs)
    .post(
        protect,
        authorizeRoles('admin'),
        uploadRateLimitMiddleware,
        uploadBlogImage.single('image'),
        validateBody(blogSchema),
        invalidateCache(CACHE_KEYS.BLOGS),
        createBlog
    );

router
    .route('/:id')
    .get(
        validateParams(idParamSchema),
        cacheMiddleware(CACHE_TTL.LONG),
        getSingleBlog
    )
    .put(
        protect,
        authorizeRoles('admin'),
        validateParams(idParamSchema),
        uploadRateLimitMiddleware,
        uploadBlogImage.single('image'),
        validateBody(blogUpdateSchema),
        invalidateCache(CACHE_KEYS.BLOGS),
        updateBlog
    )
    .delete(
        protect,
        authorizeRoles('admin'),
        validateParams(idParamSchema),
        invalidateCache(CACHE_KEYS.BLOGS),
        deleteBlog
    );

module.exports = router;
