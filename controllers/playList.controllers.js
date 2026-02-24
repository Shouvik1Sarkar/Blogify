import Blog from "../models/blog.models.js";
import PlayList from "../models/playList.models.js";
import User from "../models/user.models.js";
import ApiError from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

export const createPlayList = asyncHandler(async (req, res) => {
  const { title } = req.body;

  const authUser = req.user;

  const user = await User.findById(authUser._id);

  if (!user) {
    throw new ApiError(401, "Unauthorized");
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
    throw new ApiError(500, "Playlist could not be created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, playList, "Play List created"));
});

export const allPlayListOfUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const blogs = await PlayList.find({
    createdBy: user._id,
  });

  return res.status(200).json(new ApiResponse(200, blogs, "All blogs here."));
});

export const allBlogsOfPlayList = asyncHandler(async (req, res) => {
  const { playListId } = req.params;
  if (!playListId) {
    throw new ApiError(400, "Playlist ID is required");
  }

  const blogs = await Blog.find({
    playList: playListId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, blogs, "blogs of this playList"));
});

export const removeFromPlayList = asyncHandler(async (req, res) => {
  
});
