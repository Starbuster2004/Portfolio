const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    technologies: {
        type: [String],
        required: true,
    },
    link: {
        type: String,
    },
    image: {
        type: String,
    },
    category: {
        type: String,
        enum: ['project', 'internship', 'job'],
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Project', ProjectSchema);
