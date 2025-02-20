const TravelStory = require("../models/travelStory.model");
const fs = require("fs");
const path = require('path');

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

const getAllStories = async(req, res)=>{
    const {userId} = req.user;

    try {
        const travelStories = await TravelStory.find({userId}).sort({
            isFavorite: -1,
        });

        res.status(201).json({stories: travelStories});
    } catch (err) {
        res.status(500).json({error:true, message: err.message});
    }
}

const imageUpload = async(req,res)=>{
    try{
        if(!req.file){
            return res.status(400).json({error:true, message:"No image uploaded"});
        }

        const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
        res.status(201).json({imageUrl});
    }
    catch(err){
        res.status(500).json({error:true, message:err.message});
    }
}

module.exports = { addTravelStory, getAllStories, imageUpload };
