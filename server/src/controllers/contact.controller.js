const Contact = require('../models/Contact');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const { PAGINATION } = require('../utils/constants');

/**
 * @desc    Submit contact form
 * @route   POST /api/contact
 * @access  Public
 */
exports.submitContact = asyncHandler(async (req, res) => {
    const { name, email, message, subject, phone } = req.body;

    const newContact = await Contact.create({
        name,
        email,
        message,
        subject,
        phone,
    });

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
