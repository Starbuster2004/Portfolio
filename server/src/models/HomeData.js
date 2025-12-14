const mongoose = require('mongoose');

const HomeDataSchema = new mongoose.Schema({
    heroTitle: {
        type: String,
        required: true,
    },
    heroSubtitle: {
        type: String,
        required: true,
    },
    aboutTitle: {
        type: String,
        default: "// About Me"
    },
    aboutSubtitle: {
        type: String,
        default: "I build intelligent systems that bridge the gap between data and human experience."
    },
    aboutDescription: {
        type: String,
        default: "As an AI Engineer..."
    },
    skills: [{
        name: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: true
        }
    }],
    footerText: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        default: ""
    },
    socialLinks: {
        github: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        twitter: { type: String, default: "" },
        website: { type: String, default: "" },
    },
});

module.exports = mongoose.model('HomeData', HomeDataSchema);
