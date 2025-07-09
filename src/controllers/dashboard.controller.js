import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req,res)=>{
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId = req.user._id;

    if(!userId || !mongoose.isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user ID");
    }

    //Total videos uploaded by the user
    const totalVideos = await Video.countDocuments({
        owner: userId
    })

    //Total views on all the videos owned by the user

    const videoStats = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" },
            }
        }
    ]);

    const totalViews = videoStats[0]?.totalViews || 0;

    //total likes on videos owned by the user
    const videoLikeStats = await Like.aggregate([
        {
            $match: {
                video : {
                    $ne: null
                }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoData"
            }
        },
        { $unwind: "$videoData" },
        {
            $match: {
                "videoData.owner": new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $count: "totalLikes"
        }
    ]);

    const totalLikes = videoLikeStats[0]?.totalLikes || 0;

    const totalSubscribers = await Subscription.countDocuments({
        channel: userId
    });

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Channel stats fetched successfully", {
            totalVideos,
            totalViews,
            totalLikes,
            totalSubscribers
        })
    );

})

const getChannelVideos = asyncHandler(async (req,res)=>{
    const userId = req.user._id;

    if(!userId || !mongoose.isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user ID");
    }

    const videos = await Video.find({
        owner: userId
    }).sort({createdAt: -1});

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Channel videos fetched successfully", videos)
    );
})

export {
    getChannelStats,
    getChannelVideos
}