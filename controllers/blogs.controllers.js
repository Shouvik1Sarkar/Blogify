import Blog from "../models/blog.models.js";
import ApiError from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { available_roles } from "../utils/constants.utils.js";

export const createBlog = asyncHandler(async (req, res) => {
  const user = req.user;

  const { title, content, description } = req.body;

  const createsBlog = await Blog.create({
    title,
    description,
    content,
    createdBy: user._id,
  });

  if (!createsBlog) {
    throw new ApiError(500, "Blog created");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createsBlog, "Blog created"));
});

export const getAllBlogs = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(500, "User Not Logged In");
  }
  const user_role = user.role;
  if (user_role !== available_roles.admin) {
    throw new ApiError(500, "You are not authorized to get all the blogs");
  }
  const allBlogs = await Blog.find();

  if (!allBlogs) {
    throw new ApiError(500, "All Blogs are here");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allBlogs, "All Blogs are here."));
});
export const getUserBlogs = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(500, "User Not Logged In");
  }

  const allBlogs = await Blog.find({
    createdBy: user._id,
  });

  if (!allBlogs) {
    throw new ApiError(500, "blogs not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allBlogs, "All Blogs are here."));
});

export const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);

  if (!blog) {
    throw new ApiError(500, "Blog not found");
  }

  return res.status(200).json(new ApiResponse(200, blog, "BLOG"));
});
export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Blog.findByIdAndDelete(id);

  return res.status(200).json(new ApiResponse(200, null, "BLOG deleted"));
});
