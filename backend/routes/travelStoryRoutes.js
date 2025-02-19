const express = require("express");
const { addTravelStory, getAllStories } = require("../controllers/travelStoryControllers");
const { authenticateToken } = require("../utilities");

const router = express.Router();

router.post('/add', authenticateToken, addTravelStory);
router.get('/getall', authenticateToken, getAllStories)

module.exports = router