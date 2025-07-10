import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req,res)=>{
    const { channelId } = req.params;
    const userId = req.user._id;

    if(!channelId || !isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel ID");
    }

    if(!userId || !isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user ID");
    }

    if(channelId.toString() === userId.toString()){
        throw new ApiError(400, "You cannot subscribe to your own channel");
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: userId,
        channel: channelId
    })

    let message = "";
    let subscription = null;
    if(existingSubscription){
        //if already subscribed, unsubscribe
        await Subscription.findByIdAndDelete(existingSubscription._id);
        message = "Unsubscribed successfully";
    } else {
        //if not subscribed, subscribe
        subscription = await Subscription.create({
            subscriber: userId,
            channel: channelId
        });
        message = "Subscribed successfully";
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, message, {
            subscription: existingSubscription ? null : subscription
        })
    );
})

const getUserChannelSubscribers = asyncHandler(async (req,res)=>{
    const { channelId } = req.params;
    if(!channelId || !isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel ID");
    }

    const subscribers = await Subscription.find({
        channel: channelId
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Subscribers fetched successfully", {
            subscribers: subscribers.map(sub => sub.subscriber)
        })
    );
})

const getSubscribedChannels = asyncHandler(async (req,res)=>{
    //Extracting the userID, who has subscribed to channels
    const { subscriberId } = req.params;

    if(!subscriberId || !isValidObjectId(subscriberId)){
        throw new ApiError(400, "Invalid subscriber ID");
    }

    const subscriptions = await Subscription.find({
        subscriber: subscriberId
    });

    const channels = await User.find({
        _id: {
            $in: subscriptions.map(sub => sub.channel)
        }
    }).select("-password -email -createdAt -updatedAt");

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Subscribed channels fetched successfully", {
            channels
        })
    );

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}