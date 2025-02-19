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

const login = async(req,res)=>{
    const { email,password} = req.body;

    if( !email || !password){
        return res.status(400).json({error:true,message:"All fields are required"});
    }

    const user = await userModel.findOne({email});
    if(!user){
        return res.status(400).json({error:true,message:"User not found"});
    }

    const isPasswordValid =await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(400).json({error:true,message:"Invalid Credentials"});
    }

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
        message:"Login Successfull"
    });

}

const getUser= async(req,res)=>{
    const {userId} =req.user;

    const isUser= await userModel.findOne({_id:userId});
    if(!isUser) return res.sendStatus(401);

    return res.json({
        user:isUser,
        messages:""
    });
}

module.exports ={register, login, getUser};