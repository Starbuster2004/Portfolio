const express = require('express');
const router = express.Router();
const {
    submitContact,
    getContacts,
    deleteContact,
} = require('../controllers/contact.controller');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { validateBody, validateParams } = require('../middleware/validate.middleware');
const { contactSchema, idParamSchema } = require('../schemas/validation.schemas');
const { contactRateLimitMiddleware } = require('../middleware/rateLimit.middleware');

router.post(
    '/',
    contactRateLimitMiddleware,
    validateBody(contactSchema),
    submitContact
);

router.get(
    '/',
    protect,
    authorizeRoles('admin'),
    getContacts
);

router.delete(
    '/:id',
    protect,
    authorizeRoles('admin'),
    validateParams(idParamSchema),
    deleteContact
);

module.exports = router;
