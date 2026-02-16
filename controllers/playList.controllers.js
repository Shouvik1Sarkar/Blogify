import PlayList from "../models/playList.models.js";
import ApiError from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

export const createPlayList = asyncHandler(async (req, res) => {
  const { title } = req.body;

  const user = req.user;

  if (!user) {
    throw new ApiError(500, "User Not found");
  }

  //   const existedPlayList = await PlayList.findOne({
  //     title: title,
  //     createdBy: user._id,
  //   });

  //   if (!existedPlayList) {
  //     throw new ApiError(500, "Same play List exists. Please change the name.");
  //   }

  const playList = await PlayList.create({
    title: title,
    createdBy: user._id,
  });

  if (!playList) {
    throw new ApiError(500, "Play List not created.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, playList, "Play List created"));
});
