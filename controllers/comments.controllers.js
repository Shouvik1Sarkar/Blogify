import Comments from "../models/comments.models.js";
import User from "../models/user.models.js";
import ApiError from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

export const comment = asyncHandler(async (req, res) => {
  const user = req.user;
  const { blogId } = req.params;
  const { comment } = req.body;
  console.log("COMMENT: ", comment);

  const commentIt = await Comments.create({
    createBy: user._id,
    comment,
    blog: blogId,
  });

  if (!commentIt) {
    throw new ApiError(500, "Comment not created");
  }

  console.log("XXXXXXXXXXXXXXXXXXXXX", commentIt);

  return res.status(200).json(new ApiResponse(200, commentIt, "Comment added"));
});

export const commentOfABlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  if (!blogId) {
    throw new ApiError(500, "BLOG ID NOT FOUND");
  }

  const allComments = await Comments.find({
    blog: blogId,
  });

  if (!allComments) {
    throw new ApiError(500, "Comments not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, allComments, "All comments are here."));
});

export const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { newComment } = req.body;

  const user = req.user;

  console.log("09090909", user._id);

  if (!commentId) {
    throw new ApiError(400, "Comment ID is required");
  }

  const comment = await Comments.findOneAndUpdate(
    {
      _id: commentId,
      createBy: user._id,
    },
    {
      $set: { comment: newComment },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!comment) {
    throw new ApiError(404, "Comment not found or unauthorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(401, "COMMENT NOT FOUND");
  }

  const user = req.user;
  if (!user) {
    throw new ApiError(401, "User Not Found");
  }

  await Comments.findByIdAndDelete(commentId);

  return res.status(201).json(new ApiResponse(201, null, "COMMENT DELETED"));
});
