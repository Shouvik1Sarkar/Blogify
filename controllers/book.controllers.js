import Blog from "../models/blog.models.js";
import Bookmark from "../models/bookmark.models.js";
import ApiError from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

export const bookMarkBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new ApiError(401, "Blog Not found");
  }

  const user = req.user;
  console.log("USER: ", user);
  if (!user) {
    throw new ApiError(402, "UnAuthorized");
  }
  let isSaved;
  let message;
  const alreadySaved = await Bookmark.findOne({
    blog: blogId,
    user: user._id,
  });
  if (!alreadySaved) {
    await Bookmark.create({
      blog: blogId,
      user: user._id,
    });
    isSaved = true;
    message = "Book Marked";
  } else {
    await alreadySaved.deleteOne();
    isSaved = false;
    message = "RemovedBook Marked";
  }

  return res.status(201).json(new ApiResponse(201, isSaved, message));
});

export const getUserBookMarked = asyncHandler(async (req, res) => {
  const user = req.user;
  console.log("USER: ", user._id);
  if (!user) {
    throw new ApiError(402, "UnAuthorized");
  }
  //   console.log("xxxxxxxxxxxyyyyyyyyyyyy", user._id);
  const allBookMarks = await Bookmark.find({
    user: user._id,
  }).populate("user", "fullName userName email");

  return res
    .status(200)
    .json(new ApiResponse(200, allBookMarks, "All bookmarks"));
});
