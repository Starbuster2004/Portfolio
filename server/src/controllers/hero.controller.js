const HomeData = require('../models/HomeData');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const cacheService = require('../services/cache.service');
const { CACHE_KEYS } = require('../utils/constants');
const { deleteFromCloudinary, getPublicIdFromUrl } = require('../middleware/upload.middleware');

/**
 * @desc    Get hero data
 * @route   GET /api/hero
 * @access  Public
 */
exports.getHero = asyncHandler(async (req, res) => {
    const heroData = await HomeData.findOne().lean();
    if (!heroData) {
        throw ApiError.notFound('Hero data not found');
    }
    res.json(ApiResponse.ok(heroData));
});

/**
 * @desc    Create or Update hero data
 * @route   POST /api/hero
 * @access  Private (Admin)
 */
exports.createHero = asyncHandler(async (req, res) => {
    // Check if exists, if so update, else create
    let heroData = await HomeData.findOne();

    const { heroTitle, heroSubtitle, skills, footerText, aboutTitle, aboutSubtitle, aboutDescription, email, socialLinks } = req.body;

    if (heroData) {
        // Update
        heroData.heroTitle = heroTitle || heroData.heroTitle;
        heroData.heroSubtitle = heroSubtitle || heroData.heroSubtitle;
        heroData.skills = skills || heroData.skills;
        heroData.footerText = footerText || heroData.footerText;

        // About fields
        heroData.aboutTitle = aboutTitle || heroData.aboutTitle;
        heroData.aboutSubtitle = aboutSubtitle || heroData.aboutSubtitle;
        heroData.aboutDescription = aboutDescription || heroData.aboutDescription;

        if (email) heroData.email = email;
        if (socialLinks) heroData.socialLinks = socialLinks;

        await heroData.save();
        cacheService.invalidatePattern(CACHE_KEYS.HERO);
        return res.json(ApiResponse.ok(heroData, 'Hero data updated'));
    }

    // Create
    heroData = await HomeData.create({
        heroTitle,
        heroSubtitle,
        skills,
        footerText,
        aboutTitle,
        aboutSubtitle,
        aboutDescription,
        email,
        socialLinks
    });

    cacheService.invalidatePattern(CACHE_KEYS.HERO);
    res.status(201).json(ApiResponse.created(heroData));
});

/**
 * @desc    Upload Resume
 * @route   POST /api/hero/resume
 * @access  Private (Admin)
 */
exports.uploadResume = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw ApiError.badRequest('Please upload a file');
    }

    let heroData = await HomeData.findOne();
    if (!heroData) {
        // Create default if not exists
        heroData = new HomeData({
            heroTitle: 'Default Title',
            heroSubtitle: 'Default Subtitle',
            skills: [],
            footerText: 'Default Footer'
        });
    }

    if (heroData.resumeUrl) {
        const publicId = getPublicIdFromUrl(heroData.resumeUrl);
        if (publicId) await deleteFromCloudinary(publicId);
    }

    heroData.resumeUrl = req.file.path;
    await heroData.save();

    cacheService.invalidatePattern(CACHE_KEYS.HERO);
    cacheService.invalidatePattern(CACHE_KEYS.HERO);
    res.json(ApiResponse.ok({ resumeUrl: heroData.resumeUrl }, 'Resume uploaded successfully'));
});

/**
 * @desc    Upload Skill Icon
 * @route   POST /api/hero/skills/icon
 * @access  Private (Admin)
 */
exports.uploadSkillIcon = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw ApiError.badRequest('Please upload a file');
    }

    res.json(ApiResponse.ok({ iconUrl: req.file.path }, 'Icon uploaded successfully'));
});
