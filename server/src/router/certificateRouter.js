const express = require('express');
const router = express.Router();
const { getCertificates, createCertificate, deleteCertificate } = require('../controllers/certificate.controller');
const { protect } = require('../middleware/authMiddleware');
const { uploadCertificateImage } = require('../middleware/upload.middleware');

router.route('/')
    .get(getCertificates)
    .post(protect, require('../middleware/upload.middleware').uploadCertificateImage.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), createCertificate);

router.route('/:id')
    .delete(protect, deleteCertificate);

module.exports = router;
