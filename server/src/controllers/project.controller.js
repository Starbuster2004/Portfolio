const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const cacheService = require('../services/cache.service');
const { CACHE_KEYS, CACHE_TTL } = require('../utils/constants');
const { deleteFromCloudinary, getPublicIdFromUrl } = require('../middleware/upload.middleware');

/**
 * @desc    Get all projects
 * @route   GET /api/projects
 * @access  Public
 */
exports.getProjects = asyncHandler(async (req, res) => {
    const { category } = req.query;
    let query = {};
    if (category) {
        query.category = category;
    }

    const projects = await Project.find(query).sort({ date: -1 }).lean();
    res.json(ApiResponse.ok(projects));
});

/**
 * @desc    Get single project
 * @route   GET /api/projects/:id
 * @access  Public
 */
exports.getSingleProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id).lean();
    if (!project) {
        throw ApiError.notFound('Project not found');
    }
    res.json(ApiResponse.ok(project));
});

/**
 * @desc    Create new project
 * @route   POST /api/projects
 * @access  Private (Admin)
 */
exports.createProject = asyncHandler(async (req, res) => {
    const { title, description, technologies, link, category } = req.body;
    let image = '';
    if (req.file) {
        image = req.file.path;
    }

    // technologies might be a string if coming from form-data, Zod handles validation but we might need to parse if not handled by middleware transformation for form-data
    // Since we use Zod middleware, it should be parsed if we use validateBody, BUT validateBody works on req.body. 
    // Multer runs before validation usually. If using form-data, req.body.technologies might be a string.
    // Our Zod schema handles string -> array transformation.
    // However, if we use `validate` middleware *after* multer, req.body is already populated.
    // So we can rely on req.body being validated and transformed.

    const newProject = await Project.create({
        title,
        description,
        technologies, // Zod schema ensures this is array
        link,
        image,
        category,
    });

    cacheService.invalidatePattern(CACHE_KEYS.PROJECTS);
    res.status(201).json(ApiResponse.created(newProject));
});

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private (Admin)
 */
exports.updateProject = asyncHandler(async (req, res) => {
    let project = await Project.findById(req.params.id);
    if (!project) {
        throw ApiError.notFound('Project not found');
    }

    const updateData = { ...req.body };

    if (req.file) {
        if (project.image) {
            const publicId = getPublicIdFromUrl(project.image);
            if (publicId) await deleteFromCloudinary(publicId);
        }
        updateData.image = req.file.path;
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
    }).lean();

    cacheService.invalidatePattern(CACHE_KEYS.PROJECTS);
    res.json(ApiResponse.ok(updatedProject));
});

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private (Admin)
 */
exports.deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
        throw ApiError.notFound('Project not found');
    }

    if (project.image) {
        const publicId = getPublicIdFromUrl(project.image);
        if (publicId) await deleteFromCloudinary(publicId);
    }

    await project.deleteOne();
    cacheService.invalidatePattern(CACHE_KEYS.PROJECTS);
    res.json(ApiResponse.ok(null, 'Project removed'));
});
