const Blog = require('../models/Blog');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const cacheService = require('../services/cache.service');
const { CACHE_KEYS } = require('../utils/constants');
const { deleteFromCloudinary, getPublicIdFromUrl } = require('../middleware/upload.middleware');

/**
 * @desc    Get all blogs
 * @route   GET /api/blogs
 * @access  Public
 */
exports.getBlogs = asyncHandler(async (req, res) => {
    const { published } = req.query;
    let query = {};
    if (published !== undefined) {
        query.published = published === 'true';
    }

    const blogs = await Blog.find(query).sort({ date: -1 }).lean();
    res.json(ApiResponse.ok(blogs));
});

/**
 * @desc    Get single blog
 * @route   GET /api/blogs/:id
 * @access  Public
 */
exports.getSingleBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id).lean();
    if (!blog) {
        throw ApiError.notFound('Blog not found');
    }
    res.json(ApiResponse.ok(blog));
});

/**
 * @desc    Create new blog
 * @route   POST /api/blogs
 * @access  Private (Admin)
 */
exports.createBlog = asyncHandler(async (req, res) => {
    const { title, content, summary, tags, published, slug } = req.body;
    let image = '';
    if (req.file) {
        image = req.file.path;
    }

    const newBlog = await Blog.create({
        title,
        content,
        summary,
        tags,
        published,
        slug: slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        image,
    });

    cacheService.invalidatePattern(CACHE_KEYS.BLOGS);
    res.status(201).json(ApiResponse.created(newBlog));
});

/**
 * @desc    Update blog
 * @route   PUT /api/blogs/:id
 * @access  Private (Admin)
 */
exports.updateBlog = asyncHandler(async (req, res) => {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
        throw ApiError.notFound('Blog not found');
    }

    const updateData = { ...req.body };
    if (req.file) {
        if (blog.image) {
            const publicId = getPublicIdFromUrl(blog.image);
            if (publicId) await deleteFromCloudinary(publicId);
        }
        updateData.image = req.file.path;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
    }).lean();

    cacheService.invalidatePattern(CACHE_KEYS.BLOGS);
    res.json(ApiResponse.ok(updatedBlog));
});

/**
 * @desc    Delete blog
 * @route   DELETE /api/blogs/:id
 * @access  Private (Admin)
 */
exports.deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        throw ApiError.notFound('Blog not found');
    }

    if (blog.image) {
        const publicId = getPublicIdFromUrl(blog.image);
        if (publicId) await deleteFromCloudinary(publicId);
    }

    await blog.deleteOne();
    cacheService.invalidatePattern(CACHE_KEYS.BLOGS);
    res.json(ApiResponse.ok(null, 'Blog removed'));
});
