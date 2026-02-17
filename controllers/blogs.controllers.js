import Blog from "../models/blog.models.js";
import ApiError from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { available_roles } from "../utils/constants.utils.js";
import Comments from "../models/comments.models.js";
import PlayList from "../models/playList.models.js";
import User from "../models/user.models.js";

export const createBlog = asyncHandler(async (req, res) => {
  const user = req.user;

  const { title, content, description } = req.body;
  const { playListId } = req.params;
  let playList = null;
  if (playListId) {
    playList = await PlayList.findById(playListId);

    if (!playList) {
      throw new ApiError(404, "Playlist not found");
    }
  }

  const createsBlog = await Blog.create({
    title,
    description,
    content,
    createdBy: user._id,
    playList: playList?._id ?? undefined,
  });

  if (!createsBlog) {
    throw new ApiError(500, "Blog could not be created");
  }
  if (playListId) {
    await createsBlog.populate("playList", "title");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createsBlog, "Blog created"));
});

export const getAllBlogs = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }
  const user_role = user.role;
  if (user_role !== available_roles.admin) {
    throw new ApiError(403, "Forbidden");
  }
  const allBlogs = await Blog.find();

  if (!allBlogs) {
    throw new ApiError(500, "blogs aren't here some how.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allBlogs, "All Blogs are here."));
});

export const getUserBlogs = asyncHandler(async (req, res) => {
  // const user = req.user;
  // if (!user) {
  //   throw new ApiError(500, "User Not Logged In");
  // }

  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const user = await User.findById(userId);

  const allBlogs = await Blog.find({
    createdBy: user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, allBlogs, "All Blogs are here."));
});

export const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return res.status(200).json(new ApiResponse(200, blog, "BLOG"));
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedBlog = await Blog.findByIdAndDelete(id);

  if (!deletedBlog) {
    throw new ApiError(404, "Blog not found");
  }

  return res.status(200).json(new ApiResponse(200, null, "BLOG deleted"));
});
