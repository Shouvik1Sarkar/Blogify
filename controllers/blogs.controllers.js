import Blog from "../models/blog.models.js";
import ApiError from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

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
