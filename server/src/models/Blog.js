const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
    },
    image: {
        type: String,
    },
    tags: {
        type: [String],
        default: [],
    },
    published: {
        type: Boolean,
        default: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Blog', BlogSchema);
