import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req,res)=>{
    const { videoId } = req.params
    if(!videoId || !mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "Invalid video ID");
    }
    const comments = await Comment.find( { videoId })

    if(!comments || comments.length === 0){
        throw new ApiError(404, "No comments found for this video");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, "Comments fetched successfully", comments));
})

const addComment = asyncHandler(async (req,res)=>{
    const { videoId, tweetId } = req.params
    const { content } = req.body
    const userId = req.user._id

    if(!content || content.trim() === ""){
        throw new ApiError(400, "Comment content cannot be empty");
    }

    if(!videoId && !tweetId){
        throw new ApiError(400, "Either video ID or tweet ID must be provided");
    }

    if(videoId && !mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "Invalid video ID");
    }

    if(tweetId && !mongoose.Types.ObjectId.isValid(tweetId)){
        throw new ApiError(400, "Invalid tweet ID");
    }

    const comment = await Comment.create({
        content,
        video: videoId || undefined,
        tweet: tweetId || undefined,
        owner: userId
    })

    return res
    .status(201)
    .json(new ApiResponse(201, "Comment added successfully", comment))
})

const updateComment = asyncHandler( async (req,res)=>{
    const { commentId } = req.params
    const { newContent } = req.body
    const userId = req.user._id
    
    if(!commentId || !mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400, "Invalid comment ID");
    }
    if(!newContent || newContent.trim() === ""){
        throw new ApiError(400, "Comment content cannot be empty");
    }
    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404, "Comment not found");
    }
    if(comment.owner.toString() !== userId.toString()){
        throw new ApiError(403, "You are not authorized to update this comment");
    }

    comment.content = newContent
    await comment.save()
    return res
    .status(200)
    .json(new ApiResponse(200, "Comment updated successfully", comment))   
})

const deleteComment = asyncHandler(async (req,res)=>{
    const { commentId } = req.params 
    const userId = req.user._id
    if(!commentId || !mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400, "Invalid comment ID");
    }
    const comment= await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404, "Comment not found");
    }
    if(comment.owner.toString() !== userId.toString()){
        throw new ApiError(403, "You are not authorized to delete this comment");
    }
    await comment.deleteOne()
    return res
    .status(200)
    .json(new ApiResponse(200, "Comment deleted successfully", null))
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
};