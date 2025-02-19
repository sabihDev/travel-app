const express = require("express");
const { addTravelStory } = require("../controllers/travelStoryControllers");
const { authenticateToken } = require("../utilities");

const router = express.Router();

router.post('/add', authenticateToken, addTravelStory);

module.exports = router