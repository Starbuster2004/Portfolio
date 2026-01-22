const Contact = require('../models/Contact');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const { PAGINATION } = require('../utils/constants');
const { logger } = require('../utils/logger');

/**
 * @desc    Submit contact form
 * @route   POST /api/contact
 * @access  Public
 */
exports.submitContact = asyncHandler(async (req, res) => {
    const { name, email, message, subject, phone, website } = req.body;

    // HONEYPOT SPAM PROTECTION
    // If the 'website' field is filled, it's likely a bot
    // This field is hidden from real users but bots will fill it
    if (website) {
        logger.warn({ ip: req.ip, email }, 'Honeypot triggered - spam bot detected');
        // Return success to not alert the bot, but don't save
        return res.status(201).json(ApiResponse.created({}, 'Message sent successfully'));
    }

    // Additional spam checks
    const spamPatterns = [
        /\b(viagra|cialis|casino|lottery|winner|claim|prize)\b/i,
        /\b(click here|buy now|limited time|act now)\b/i,
        /(http[s]?:\/\/){2,}/i, // Multiple URLs
    ];

    const combinedText = `${name} ${message} ${subject || ''}`;
    const isSpam = spamPatterns.some(pattern => pattern.test(combinedText));

    if (isSpam) {
        logger.warn({ ip: req.ip, email }, 'Spam content detected in contact form');
        // Return success to not alert the spammer
        return res.status(201).json(ApiResponse.created({}, 'Message sent successfully'));
    }

    // Validate email format more strictly
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        throw ApiError.badRequest('Please provide a valid email address');
    }

    // Create the contact record
    const newContact = await Contact.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        message: message.trim(),
        subject: subject?.trim(),
        phone: phone?.trim(),
    });

    logger.info({ contactId: newContact._id, email }, 'New contact form submission received');

    res.status(201).json(ApiResponse.created(newContact, 'Message sent successfully'));
});

/**
 * @desc    Get all contacts (Admin)
 * @route   GET /api/contact
 * @access  Private (Admin)
 */
exports.getContacts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
    const limit = parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    const contacts = await Contact.find()
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await Contact.countDocuments();

    res.json(ApiResponse.paginated(contacts, page, limit, total));
});

/**
 * @desc    Delete contact
 * @route   DELETE /api/contact/:id
 * @access  Private (Admin)
 */
exports.deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        throw ApiError.notFound('Contact message not found');
    }

    await contact.deleteOne();
    res.json(ApiResponse.ok(null, 'Contact message removed'));
});
