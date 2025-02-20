require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
const path =require("path");
const fs = require("fs");

const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes.js");
const travelStoryRoutes = require("./routes/travelStoryRoutes.js");

const jwt = require("jsonwebtoken");

mongoose.connect(config.connectionString)

const app = express();
app.use(express.json());
app.use(cors({origin:"*"}));

app.use('/api/user', userRoutes);
app.use('/api/travel-story', travelStoryRoutes);

app.delete('/delete-image',async(req,res)=>{
    const {imageUrl} = req.query;
    if(!imageUrl){
        return res.status(400).json({error:true, message:"imageUrl parameter required"});
    }

    try {
        
        const filename = path.basename(imageUrl);

        const filePath = path.join(__dirname, "uploads", filename);

        if(fs.existsSync(filePath)){

            fs.unlinkSync(filePath);
            res.status(200).json({error:false, message:"Image deleted successfully"});
        }
        else{
            res.status(400).json({error:true, message:"Image not found"});
        }
    } catch (err) {
        res.status(500).json({error:true, message:err.message});
    }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.listen(8000);
module.exports = app;