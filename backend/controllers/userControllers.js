const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model.js");


const register= async(req, res)=>{
    const {fullName, email,password} = req.body;

    if(!fullName || !email || !password){
        return res.status(400).json({error:true,message:"All fields are required"});
    }

    const isUserExist = await userModel.findOne({email});
    if(isUserExist){
        return res.status(400).json({error:true,message:"User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = new userModel({
        fullName,
        email,
        password:hashedPassword
    });

    await user.save();

    const accessToken = jwt.sign(
        {userId: user._id},
        process.env.JWT_SECRET,
        {
            expiresIn:"72h"
        }
    );

    return res.status(201).json({
        error:false,
        user:{fullName:user.fullName, email:user.email},
        accessToken,
        message:"Registration Successfull"
    });
}

module.exports ={register};