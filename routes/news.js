// news.js route
const express = require('express');
const router = express.Router();
const News = require('../models/newsSchema'); // Correct import of the News model
const multer = require('multer');
const cloudinary = require('../middleware/cloudinary');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/add', upload.array('media'), async (req, res) => {
    const { title, description, url } = req.body;

    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Upload images to Cloudinary
        const mediaUrls = await Promise.all(req.files.map(file => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { resource_type: 'auto' },
                    (error, result) => {
                        if (error) {
                            console.error('Error uploading to Cloudinary:', error);
                            return reject(error);
                        }
                        resolve(result.secure_url); 
                    }
                ).end(file.buffer);
            });
        }));

        // Create a new News document
        const newNews = new News({
            title,
            description,
            url,
            image: mediaUrls.filter(url => url.endsWith('.jpg') || url.endsWith('.png')),
        });

        // Save the news item to the database
        const savedNews = await newNews.save();
        res.status(201).json({ message: 'News added successfully', data: savedNews });
    } catch (error) {
        console.error('Error adding news:', error);
        res.status(500).json({ message: 'Error adding news', error: error.message });
    }
});

router.get('/getNews', async (req, res) => {
    try {
        const newsList = await News.find();
        res.status(200).json({ message: 'News fetched successfully', data: newsList });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Error fetching news', error: error.message });
    }
});

module.exports = router;
