require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
const path =require("path");

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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(8000);
module.exports = app;