import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import uploadToCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req,res) => {
    //get user detail from frontend
    //validate the user data
    //check if user already exists: username and email
    //check for images, check for avatar
    //upload images to cloudinary
    //create user object - create user in database
    //remove password and refresh token field from response
    //check for user creation
    //return response to frontend

    const {fullName, email, username, password} = req.body
    console.log("email: ", email);
    console.log(res.body);

    if(
        [fullName, email, username, password].some((field) =>field?.trim() ==="")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser) {
        throw new ApiError(409, "Username or email already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadToCloudinary(avatarLocalPath);
    const coverImage = await uploadToCloudinary(coverImageLocalPath);

    if(!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    })

    const createdUSer = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUSer) {
        throw new ApiError(500, "Something went wrong while registering user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUSer, "User registered successfully")
    )

})  

export default registerUser