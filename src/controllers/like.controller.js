import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import  asyncHandler  from "../utils/asyncHandler.js";
import  ApiError  from "../utils/ApiError.js";
import  ApiResponse  from "../utils/ApiResponse.js";

const toggleVideoLike = asyncHandler(async (req,res)=>{
    const { videoId } = req.params;
    const userId = req.user._id;

    if(!videoId || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video ID");
    }

    const alreadyLiked = await Like.findOne({
        video: videoId,
        likedBy: userId
    })

    let message="";
    let newLike = null;

    if(alreadyLiked){
        //if already liked, remove the like
        await Like.deleteOne({
            video: videoId,
            likedBy: userId
        })
        message = "Like removed successfully";
    } else{
        //if not liked, add the like
        newLike = await Like.create({
            video: videoId,
            likedBy: userId
        });
        message = "Like added successfully";
    }

    return res
    .status(200)
    .json( new ApiResponse(200, message, newLike))
})

const toggleCommentLike = asyncHandler(async (req,res)=>{
    const { commentId } = req.params;
    const userId = req.user._id;

    if(!commentId || !isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment ID");
    }

    const alreadyLiked = await Like.findOne({
        comment: commentId,
        likedBy: userId
    })

    let message = "";
    let newLike = null;

    if(alreadyLiked){
        //if already liked, remove the like
        await Like.deleteOne({
            comment: commentId,
            likedBy: userId
        })
        message = "Like removed successfully";
    } else {
        //if not liked, add the like
        newLike = await Like.create({
            comment: commentId,
            likedBy: userId
        });
        message = "Like added successfully";
    }

    return res
    .status(200)
    .json(new ApiResponse(200, message, newLike))
})

const toggleTweetLike = asyncHandler(async (req,res)=>{
    const { tweetId } = req.params;
    const userId = req.user._id;

    if(!tweetId || !isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet ID");
    }

    const alreadyLiked = await Like.findOne({
        tweet: tweetId,
        likedBy: userId
    })

    let message = "";
    let newLike = null;

    if(alreadyLiked){
        //if already liked, remove the like
        await Like.deleteOne({
            tweet: tweetId,
            likedBy: userId
        })
        message = "Like removed successfully";
    } else {
        //if not liked, add the like
        newLike = await Like.create({
            tweet: tweetId,
            likedBy: userId
        });
        message = "Like added successfully";
    }

    return res
    .status(200)
    .json(new ApiResponse(200, message, newLike))
})

const getLikedVideos = asyncHandler(async (req,res)=>{
    const userId = req.user._id;

    const likedVideos = await Like.find({
        likedBy: userId,
        video: { $exists: true, $ne: null }
    }).populate("video")

    const videos = likedVideos.map(like => like.video);

    return res
    .status(200)
    .json(new ApiResponse(200, "Liked videos fetched successfully", videos))
})

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}