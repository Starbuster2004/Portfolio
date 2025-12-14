const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    serialId: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    pdf: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Certificate', certificateSchema);
