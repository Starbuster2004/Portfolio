const Certificate = require('../models/certificate.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const { getPublicIdFromUrl, deleteFromCloudinary } = require('../middleware/upload.middleware');

exports.getCertificates = asyncHandler(async (req, res) => {
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.status(200).json(new ApiResponse(200, certificates, 'Certificates fetched successfully'));
});

exports.createCertificate = asyncHandler(async (req, res) => {
    const { title, serialId } = req.body;
    let image = '';
    let pdf = '';

    if (req.files) {
        if (req.files.image && req.files.image[0]) {
            image = req.files.image[0].path;
        }
        if (req.files.pdf && req.files.pdf[0]) {
            pdf = req.files.pdf[0].path;
        }
    }

    if (!title || !serialId || !image) {
        res.status(400);
        throw new Error('Please provide title, serial ID and image');
    }

    const certificate = await Certificate.create({
        title,
        serialId,
        image,
        pdf
    });

    res.status(201).json(new ApiResponse(201, certificate, 'Certificate created successfully'));
});

exports.deleteCertificate = asyncHandler(async (req, res) => {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
        res.status(404);
        throw new Error('Certificate not found');
    }

    if (certificate.image) {
        const publicId = getPublicIdFromUrl(certificate.image);
        if (publicId) {
            await deleteFromCloudinary(publicId);
        }
    }

    await Certificate.findByIdAndDelete(req.params.id);

    res.status(200).json(new ApiResponse(200, null, 'Certificate deleted successfully'));
});
