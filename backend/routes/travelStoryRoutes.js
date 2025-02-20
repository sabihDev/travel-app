const express = require("express");
const { addTravelStory, getAllStories, imageUpload, } = require("../controllers/travelStoryControllers");
const { authenticateToken } = require("../utilities");
const {upload} = require("../multer");
const fs = require("fs");
const path = require('path');

const router = express.Router();

router.post('/add', authenticateToken, addTravelStory);
router.get('/getall', authenticateToken, getAllStories);
router.post('/image-upload', upload.single("image"), imageUpload);

module.exports = router