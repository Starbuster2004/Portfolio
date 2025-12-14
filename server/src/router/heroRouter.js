const express = require('express');
const router = express.Router();
const {
    getHero,
    createHero,
    uploadResume,
} = require('../controllers/hero.controller');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validate.middleware');
const { heroSchema } = require('../schemas/validation.schemas');
const { cacheMiddleware, invalidateCache } = require('../middleware/cache.middleware');
const { uploadResume: uploadResumeMiddleware } = require('../middleware/upload.middleware');
const { CACHE_KEYS, CACHE_TTL } = require('../utils/constants');
const { uploadRateLimitMiddleware } = require('../middleware/rateLimit.middleware');

router
    .route('/')
    .get(cacheMiddleware(CACHE_TTL.HOUR), getHero)
    .post(
        protect,
        authorizeRoles('admin'),
        validateBody(require('../schemas/validation.schemas').heroUpdateSchema),
        invalidateCache(CACHE_KEYS.HERO),
        createHero
    );

router.post(
    '/resume',
    protect,
    authorizeRoles('admin'),
    uploadRateLimitMiddleware,
    uploadResumeMiddleware.single('resume'),
    invalidateCache(CACHE_KEYS.HERO),
    uploadResume
);

router.post(
    '/skills/icon',
    protect,
    authorizeRoles('admin'),
    uploadRateLimitMiddleware,
    require('../middleware/upload.middleware').uploadSkillImage.single('icon'),
    require('../controllers/hero.controller').uploadSkillIcon
);

module.exports = router;
