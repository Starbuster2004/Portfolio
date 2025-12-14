const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
    },
    role: {
        type: String,
        required: [true, 'Role/Position is required'],
        trim: true,
    },
    period: {
        type: String,
        required: [true, 'Period is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    tags: [{
        type: String,
        trim: true,
    }],
    order: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

// Sort by order by default
ExperienceSchema.pre('find', function () {
    this.sort({ order: 1 });
});

module.exports = mongoose.model('Experience', ExperienceSchema);
