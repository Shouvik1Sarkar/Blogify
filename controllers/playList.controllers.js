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
  }).populate("playList");

  return res
    .status(201)
    .json(new ApiResponse(201, blogs, "blogs of this playList"));
});

export const removeFromPlayList = asyncHandler(async (req, res) => {
  const { playListId, blogId } = req.params;

  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Un authorized");
  }
  const blog = await Blog.findOne({
    _id: blogId,
    playList: playListId,
    createdBy: user._id,
  });

  if (!blog) {
    throw new ApiError(404, "Not found blog");
  }

  blog.playList = undefined;
  await blog.save();

  return res.status(200).json(new ApiResponse(200, null, "Deleted"));
});

export const deletePlayList = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Un Authorized");
  }

  const { playListId } = req.params;

  const playList = await PlayList.findOne({
    createdBy: user._id,
    _id: playListId,
  });

  if (!playList) {
    throw new ApiError(404, "Not Found");
  }

  await Blog.updateMany(
    { playList: playListId }, // filter
    { $set: { playList: null } },
  );
  await playList.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, "Deleted"));
});
