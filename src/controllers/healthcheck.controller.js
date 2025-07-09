import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthCheck = asyncHandler(async (req,res)=>{
    return res
           .status(200)
           .json(new ApiResponse(200, "Health check successful", { status: "OK" }));
})

export {
    healthCheck
}