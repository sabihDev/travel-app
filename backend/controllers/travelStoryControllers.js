const TravelStory = require("../models/travelStory.model");

const addTravelStory = async (req, res) => {
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const {userId} = req.user;

    if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
        return res.status(400).json({ message: "All fields are required" });
    }

    let parsedVisitedDate;
    try {
        parsedVisitedDate = new Date(parseInt(visitedDate));
        if (isNaN(parsedVisitedDate.getTime())) {
            throw new Error("Invalid date format");
        }
    } catch (error) {
        return res.status(400).json({ message: "Invalid visitedDate format" });
    }

    try {
        const travelStory = new TravelStory({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl,
            visitedDate: parsedVisitedDate,
        });

        await travelStory.save();

        res.status(201).json({
            story: travelStory,
            message: "Story added successfully",
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: err.message || "Something went wrong",
        });
    }
};

module.exports = { addTravelStory };
