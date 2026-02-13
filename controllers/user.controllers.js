import ApiError from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

export const getUser = asyncHandler(async (req, res) => {
  const user = req.user;
  console.log("USER: ", user);
  if (!user) {
    throw new ApiError(500, "NOT LOGGEDIN");
  }

  return res.status(200).json(new ApiResponse(200, user, "THIS IS USER"));
});
