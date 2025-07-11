import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js"
import  asyncHandler  from "../utils/asyncHandler.js";
import  ApiError  from "../utils/ApiError.js";
import  ApiResponse  from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js"  

const createPlaylist = asyncHandler(async (req, res)=>{
    const { name, description } = req.body;

    if (!name || !description) {
        throw new ApiError(400, "Name and description are required");
    }

    const userId = req.user._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: userId
    })

    return res
    .status(201)
    .json(new ApiResponse(201, "Playlist created successfully", playlist));
})

const getUserPlaylists = asyncHandler(async (req,res)=>{
    const userId = req.user._id;

    if(!userId || !isValidObjectId(userId)){
        throw new ApiError(400, "Invalid userId");
    }

    const user = await User.findById(userId);

    if(!user){
        throw new ApiError(404, "User not found");
    }

    const playlists = await Playlist.find({
        owner: userId
    })

    return res
    .status(200)
    .json(new ApiResponse(200, "User playlists fetched successfully", playlists));
})

const getPlaylistById = asyncHandler(async (req,res)=>{
    const { playlistId } = req.params;
    if(!playlistId || !isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.findById(playlistId).populate("owner", "name email");
    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, "Playlist fetched successfully", playlist));
})

const addVideoToPlaylist = asyncHandler(async (req,res)=>{
    const { playlistId, videoId } = req.body;
    const userId = req.user._id;

    if(!playlistId || !isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist ID");
    }

    if(!videoId || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video ID");
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    if(playlist.owner.toString() !== userId.toString()){
        throw new ApiError(403, "You are not authorized to add videos to this playlist");
    }

    if(playlist.videos.includes(videoId)){
        throw new ApiError(400, "Video already exists in the playlist");
    }

    playlist.videos.push(videoId);
    await playlist.save();

    return res
    .status(201)
    .json(new ApiResponse(201, "Video added to playlist successfully", playlist));
})

const removeVideoFromPlaylist = asyncHandler(async (req,res)=>{
    const { playlistId, videoId } = req.params;
    const userId = req.user._id;

    if(!playlistId || !isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist ID");
    }

    if(!videoId || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video ID");
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    if(playlist.owner.toString() !== userId.toString()){
        throw new ApiError(403, "You are not authorized to remove videos from this playlist");
    }

    if(!playlist.videos.includes(videoId)){
        throw new ApiError(400, "Video does not exist in the playlist");
    }

    playlist.videos = playlist.videos.filter((video)=> video.toString() !== videoId.toString());
    await playlist.save();

    return res
    .status(200)
    .json(new ApiResponse(200, "Video removed from playlist successfully", playlist));
})

const deletePlaylist = asyncHandler(async (req,res)=>{
    const { playlistId } = req.params;
    const userId = req.user._id;

    if(!playlistId || !isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist ID");
    }

    const playlist = await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    if(playlist.owner.toString() !== userId.toString()){
        throw new ApiError(403, "You are not authorized to delete this playlist");
    }

    await playlist.deleteOne();

    return res
    .status(200)
    .json(new ApiResponse(200, "Playlist deleted successfully"));
})

const updatePlaylist = asyncHandler(async (req,res)=>{
    const { playlistId } = req.params;
    const { name, description } = req.body;
    const userId = req.user._id;

    if(!playlistId || !isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist ID");
    }
    if(!name || !description){
        throw new ApiError(400, "Name and description are required");
    }
    const playlist = await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }
    if(playlist.owner.toString() !== userId.toString()){
        throw new ApiError(403, "You are not authorized to update this playlist");
    }
    playlist.name = name;
    playlist.description = description;
    await playlist.save();

    return res
    .status(200)
    .json(new ApiResponse(200, "Playlist updated successfully", playlist));
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}

