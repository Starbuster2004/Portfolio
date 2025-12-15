const Experience = require('../models/Experience');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const cacheService = require('../services/cache.service');
const { CACHE_KEYS } = require('../utils/constants');

/**
 * @desc    Get all experiences
 * @route   GET /api/experiences
 * @access  Public
 */
exports.getExperiences = asyncHandler(async (req, res) => {
    const experiences = await Experience.find({ isActive: true }).sort({ order: 1 });
    res.json(ApiResponse.ok(experiences));
});

/**
 * @desc    Get all experiences (including inactive) for admin
 * @route   GET /api/experiences/admin
 * @access  Private (Admin)
 */
exports.getExperiencesAdmin = asyncHandler(async (req, res) => {
    const experiences = await Experience.find().sort({ order: 1 });
    res.json(ApiResponse.ok(experiences));
});

/**
 * @desc    Get single experience
 * @route   GET /api/experiences/:id
 * @access  Public
 */
exports.getExperience = asyncHandler(async (req, res) => {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
        throw ApiError.notFound('Experience not found');
    }
    res.json(ApiResponse.ok(experience));
});

/**
 * @desc    Create experience
 * @route   POST /api/experiences
 * @access  Private (Admin)
 */
exports.createExperience = asyncHandler(async (req, res) => {
    const { company, role, period, description, tags, order, isActive } = req.body;

    // Get the highest order number
    const lastExp = await Experience.findOne().sort({ order: -1 });
    const newOrder = order !== undefined ? order : (lastExp ? lastExp.order + 1 : 0);

    const experience = await Experience.create({
        company,
        role,
        period,
        description,
        tags: tags || [],
        order: newOrder,
        isActive: isActive !== undefined ? isActive : true,
    });

    cacheService.invalidatePattern(CACHE_KEYS.EXPERIENCES);
    res.status(201).json(ApiResponse.created(experience));
});

/**
 * @desc    Update experience
 * @route   PUT /api/experiences/:id
 * @access  Private (Admin)
 */
exports.updateExperience = asyncHandler(async (req, res) => {
    const { company, role, period, description, tags, order, isActive } = req.body;

    let experience = await Experience.findById(req.params.id);
    if (!experience) {
        throw ApiError.notFound('Experience not found');
    }

    experience.company = company || experience.company;
    experience.role = role || experience.role;
    experience.period = period || experience.period;
    experience.description = description || experience.description;
    experience.tags = tags !== undefined ? tags : experience.tags;
    if (order !== undefined) experience.order = order;
    if (isActive !== undefined) experience.isActive = isActive;

    await experience.save();
    cacheService.invalidatePattern(CACHE_KEYS.EXPERIENCES);
    res.json(ApiResponse.ok(experience, 'Experience updated successfully'));
});

/**
 * @desc    Delete experience
 * @route   DELETE /api/experiences/:id
 * @access  Private (Admin)
 */
exports.deleteExperience = asyncHandler(async (req, res) => {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
        throw ApiError.notFound('Experience not found');
    }

    await Experience.findByIdAndDelete(req.params.id);
    cacheService.invalidatePattern(CACHE_KEYS.EXPERIENCES);
    res.json(ApiResponse.ok(null, 'Experience deleted successfully'));
});

/**
 * @desc    Reorder experiences
 * @route   PUT /api/experiences/reorder
 * @access  Private (Admin)
 */
exports.reorderExperiences = asyncHandler(async (req, res) => {
    const { orderedIds } = req.body;

    if (!orderedIds || !Array.isArray(orderedIds)) {
        throw ApiError.badRequest('orderedIds array is required');
    }

    // Update each experience with new order
    const updates = orderedIds.map((id, index) =>
        Experience.findByIdAndUpdate(id, { order: index })
    );

    await Promise.all(updates);
    cacheService.invalidatePattern(CACHE_KEYS.EXPERIENCES);
    res.json(ApiResponse.ok(null, 'Experiences reordered successfully'));
});
