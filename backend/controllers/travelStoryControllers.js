const TravelStory = require("../models/travelStory.model");
const fs = require("fs");
const path = require('path');

const addTravelStory = async (req, res) => {
    try {
        const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;

        // Ensure req.user exists and has userId
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const userId = req.user.userId;

        // Validate required fields
        if (![title, story, visitedLocation, imageUrl, visitedDate]) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Parse visitedDate correctly
        let parsedVisitedDate;
        if (!isNaN(visitedDate)) {
            // If visitedDate is a number, check its length
            parsedVisitedDate = new Date(Number(visitedDate.toString().length === 10 ? visitedDate * 1000 : visitedDate));
        } else {
            parsedVisitedDate = new Date(visitedDate);
        }

        // Check if parsed date is valid
        if (isNaN(parsedVisitedDate.getTime())) {
            return res.status(400).json({ message: "Invalid visitedDate format." });
        }

        // Create and save the travel story
        const travelStory = new TravelStory({
            title: title,
            story: story,
            visitedLocation: visitedLocation,
            userId,
            imageUrl: imageUrl,
            visitedDate: parsedVisitedDate,
        });

        await travelStory.save();

        return res.status(201).json({
            story: travelStory,
            message: "Story added successfully",
        });

    } catch (err) {
        console.error("Error adding travel story:", err);
        return res.status(500).json({
            error: true,
            message: err.message || "Something went wrong",
        });
    }
};


const getAllStories = async (req, res) => {
    const { userId } = req.user;

    try {
        const travelStories = await TravelStory.find({ userId }).sort({
            isFavorite: -1,
        });

        res.status(201).json({ stories: travelStories });
    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
}

const imageUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: true, message: "No image uploaded" });
        }

        const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
        res.status(201).json({ imageUrl });
    }
    catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
}

const editTravelStory = async (req, res) => {
    const { id } = req.params;
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;

    if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
        const travelStory = await TravelStory.findOne({ _id: id, userId });

        if (!travelStory) {
            return res.status(400).json({ error: true, message: "Story not found" });
        }

        const placeholderImage = `http://localhost:8000/assets/images.png`;

        travelStory.title = title;
        travelStory.story = story;
        travelStory.visitedLocation = visitedLocation;
        travelStory.imageUrl = imageUrl || placeholderImage;
        travelStory.visitedDate = parsedVisitedDate;

        await travelStory.save();
        return res.status(200).json({ error: false, message: "Story Updated Successfully" });
    } catch (err) {
        return res.status(400).json({ error: true, message: err.message });
    }
}

const deleteStory = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    try {
        const travelStory = await TravelStory.findOne({ _id: id, userId });

        if (!travelStory) {
            return res.status(400).json({ error: true, message: "Story not found" });
        }

        // Delete the travel story from the database
        await TravelStory.findByIdAndDelete(id);

        // Delete the image file
        const imageUrl = travelStory.imageUrl;
        if (imageUrl) {
            const filename = path.basename(imageUrl);
            const filePath = path.join(__dirname, "../uploads", filename);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Failed to delete image file:", err);
                }
            });
        }

        return res.status(200).json({ error: false, message: "Travel story deleted successfully" });
    } catch (err) {
        return res.status(400).json({ error: true, message: err.message });
    }
};

const updateFavoriteById = async (req, res) => {
    const { id } = req.params;
    const { isFavorite } = req.body;
    const { userId } = req.user;

    try {
        const travelStory = await TravelStory.findOne({ _id: id, userId });

        if (!travelStory) {
            return res.status(400).json({ error: true, message: "Story not found" });
        }

        travelStory.isFavorite = isFavorite;

        await travelStory.save();
        res.status(200).json({ story: travelStory, message: "Update Successfull" });
    }
    catch (err) {
        res.status(200).json({ error: true, message: err.message });
    }
}

const searchStory = async (req, res) => {
    const { query } = req.query;
    const { userId } = req.user;

    if (!query) return res.status(400).json({ error: true, message: "Query is required" });

    try {
        const searchResults = await TravelStory.find({
            userId,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { story: { $regex: query, $options: "i" } },
                { visitedLocation: { $regex: query, $options: "i" } },
            ],
        }).sort({ isFavorite: -1 });

        res.status(200).json({ error: false, stories: searchResults });
    } catch (err) {
        res.status(400).json({ error: true, message: error.message });
    }
}

const filterDateSearch = async (req, res) => {
    const { startDate, endDate } = req.query;
    const { userId } = req.user;

    try {
        const parsedStartDate = new Date(parseInt(startDate));
        const parsedEndDate = new Date(parseInt(endDate));

        const filteredStories = await TravelStory.find({
            userId,
            visitedDate: { $gte: parsedStartDate, $lte: parsedEndDate }
        }).sort({ isFavorite: -1 });

        res.status(200).json({ error: false, stories: filteredStories });
    } catch (err) {
        res.status(400).json({ error: true, message: err.message });
    }
}

module.exports = { addTravelStory, getAllStories, imageUpload, editTravelStory, deleteStory, updateFavoriteById, searchStory, filterDateSearch };
