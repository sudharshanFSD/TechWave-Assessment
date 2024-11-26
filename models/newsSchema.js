// newsSchema.js
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    image: [String],  // Array of image URLs
});

const News = mongoose.model('News', newsSchema); // Define and export the model

module.exports = News;
