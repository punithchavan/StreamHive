import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose , { Schema } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { use } from "react";

const createTweet = asyncHandler(async (req,res)=>{
    const { content } = req.body
    const userId = req.user._id

    if(!content || content.trim() === ""){
        throw new ApiError(400, "Content is required")
    }

    const user = await User.findById(userId)

    if(!user){
        throw new ApiError(404, "User not found")
    }

    const tweet = await Tweet.create({
        content,
        owner: user._id
    })

    return res
    .status(201)
    .json(new ApiResponse(201, "Tweet created successfully", tweet))

})

const getUserTweets = asyncHandler(async (req,res)=>{
    const userId = req.user._id
    if(!userId || !mongoose.isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user ID")
    }

    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(404, "User not found")
    }

    const tweets = await Tweet.find({
        owner: user._id
    }).sort( { createdAt: -1 })

    return res
    .status(200)
    .json(new ApiResponse(200, "User tweets fetched successfully", tweets))
})

const updateTweet = asyncHandler(async (req,res)=>{
    const { tweetId } = req.params
    const userId = req.user._id
    const { newContent } = req.body

    if(!tweetId || !mongoose.isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet ID")
    }

    if(!newContent || newContent.trim() === ""){
        throw new ApiError(400, "New content is required")
    }

    const tweet = await Tweet.findOne({
        _id: tweetId,
        owner: userId
    })

    if(!tweet){
        throw new ApiError(404, "Tweet not found or you do not have permission to update it")
    }

    tweet.content = newContent
    await tweet.save()

    return res
    .status(200)
    .json(new ApiResponse(200, "Tweet updated successfully", tweet))
})

const deleteTweet =asyncHandler(async (req,res)=>{
    const { tweetId } = req.params
    const userId = req.user._id

    if(!tweetId || !mongoose.isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet ID")
    }

    const tweet = await Tweet.findOneAndDelete({
        _id: tweetId,
        owner: userId
    })

    if(!tweet){
        throw new ApiError(404, "Tweet not found or you do not have permission to delete it")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, "Tweet deleted successfully", null))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
