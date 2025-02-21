const express = require("express");
const { addTravelStory, getAllStories, imageUpload, editTravelStory, } = require("../controllers/travelStoryControllers");
const { authenticateToken } = require("../utilities");
const {upload} = require("../multer");

const router = express.Router();

router.post('/add', authenticateToken, addTravelStory);
router.get('/getall', authenticateToken, getAllStories);
router.post('/image-upload', upload.single("image"), imageUpload);
router.post("/edit/:id", authenticateToken, editTravelStory);

module.exports = router