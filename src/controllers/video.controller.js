import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req,res)=>{
    const { page = 1, limit = 10, query = "", sortBy = "createdAt", sortType = "desc", userId } =req.query;

    const matchStage = {
        isPublished: true
    };

    if(query) {
        matchStage.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }

    if (userId && isValidObjectId(userId)) {
        matchStage.owner = new mongoose.Types.ObjectId(userId);
    }

    const sortOrder = sortType === "asc" ? 1 : -1;

    const aggregateQuery = Video.aggregate([
        { $match: matchStage },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        { $unwind: "$owner" },
        {
            $project: {
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                createdAt: 1,
                owner: {
                    _id: "$owner._id",
                    username: "$owner.username",
                    avatar: "$owner.avatar"
                }
            }
        },
        {
            $sort: {
                [sortBy]: sortOrder
            }
        }
    ]);

    const options = {
        page: parseInt(page),
        limit: parseInt(limit)
    };

    const result = await Video.aggregatePaginate(aggregateQuery, options);

    return res.status(200).json(
        new ApiResponse(200, "Videos fetched successfully", result)
    );
})

const publishAVideo = asyncHandler(async (req,res)=>{
    const { title, description, duration } = req.body;
    const userId = req.user._id;
    
    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if(!title || !description || !duration){
        throw new ApiError(400, "Title, description, and duration are required");
    }

    if(!videoLocalPath){
        throw new ApiError(400, "Video is required");
    }

    const uploadedVideo = await uploadOnCloudinary(videoLocalPath);
    if(!uploadedVideo){
        throw new ApiError(500, "Failed to upload to Cloudinary");
    }

    let uploadedThumbnail = null;
    if (thumbnailLocalPath) {
        uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    }

    const videoDoc = await Video.create({
        videoFile: uploadedVideo.public_id,
        thumbnail: uploadedThumbnail?.public_id || "",
        title,
        description,
        duration: parseFloat(duration),
        owner: userId,
        isPublished: true
    });

     return res
     .status(201)
     .json(new ApiResponse(201, "Video published successfully", videoDoc))


})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findOne({
        _id: videoId,
        owner: userId
    });

    if (!video) {
        throw new ApiError(404, "Video not found or you do not have access");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, "Video fetched successfully", video));
});


export {
    getAllVideos,
    publishAVideo,
    getVideoById
}