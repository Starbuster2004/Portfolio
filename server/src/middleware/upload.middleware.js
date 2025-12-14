const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { UPLOAD_LIMITS } = require('../utils/constants');
const ApiError = require('../utils/apiError');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createUploader = (folder, allowedFormats = UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES) => {
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: `portfolio/${folder}`,
            allowed_formats: allowedFormats.map(t => t.split('/')[1]),
            resource_type: 'auto',
        },
    });

    return multer({
        storage: storage,
        limits: { fileSize: UPLOAD_LIMITS.MAX_FILE_SIZE },
        fileFilter: (req, file, cb) => {
            if (allowedFormats.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new ApiError(400, 'Invalid file type'), false);
            }
        },
    });
};

const uploadProjectImage = createUploader('projects');
const uploadBlogImage = createUploader('blogs');
const uploadCertificateImage = createUploader('certificates', [...UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES, ...UPLOAD_LIMITS.ALLOWED_DOC_TYPES]);
const uploadSkillImage = createUploader('skills');
const uploadHeroImage = createUploader('hero');
const uploadResume = createUploader('resumes', UPLOAD_LIMITS.ALLOWED_DOC_TYPES);
const upload = createUploader('general'); // Backward compatibility

const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
    }
};

const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];
    // This is a simplified extraction. For full robustness, might need more parsing depending on Cloudinary URL structure.
    // Assuming standard structure: .../upload/v123456/portfolio/folder/publicId.jpg
    // Better: extract everything after 'upload/' and remove version and extension.
    // But for now, let's stick to a simple regex or split.
    // Actually, Cloudinary public IDs can include folders.
    // Example: portfolio/projects/my-image
    // URL: https://res.cloudinary.com/demo/image/upload/v123456/portfolio/projects/my-image.jpg
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

module.exports = {
    uploadProjectImage,
    uploadBlogImage,
    uploadCertificateImage,
    uploadSkillImage,
    uploadHeroImage,
    uploadResume,
    upload,
    deleteFromCloudinary,
    getPublicIdFromUrl,
};
