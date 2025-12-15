const express = require('express');
const router = express.Router();
const { getCertificates, createCertificate, deleteCertificate } = require('../controllers/certificate.controller');
const { protect } = require('../middleware/authMiddleware');
const { uploadCertificateImage } = require('../middleware/upload.middleware');
const { cacheMiddleware } = require('../middleware/cache.middleware');
const { CACHE_TTL } = require('../utils/constants');

router.route('/')
    .get(cacheMiddleware(CACHE_TTL.SHORT), getCertificates)
    .post(protect, require('../middleware/upload.middleware').uploadCertificateImage.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), createCertificate);

router.route('/:id')
    .delete(protect, deleteCertificate);

module.exports = router;

