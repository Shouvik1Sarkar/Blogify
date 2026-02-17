import Comments from "../models/comments.models.js";
import User from "../models/user.models.js";
import ApiError from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

export const comment = asyncHandler(async (req, res) => {
  const authUser = req.user;

  const user = await User.findById(authUser._id);

  const { blogId } = req.params;
  const { comment } = req.body;
  // console.log("COMMENT: ", comment);

  const commentIt = await Comments.create({
    createdBy: user._id,
    comment,
    blog: blogId,
  });

  if (!commentIt) {
    throw new ApiError(401, "Unauthorized");
  }

  // console.log("XXXXXXXXXXXXXXXXXXXXX", commentIt)d;

  return res.status(201).json(new ApiResponse(201, commentIt, "Comment added"));
});

export const commentOfABlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  if (!blogId) {
    throw new ApiError(400, "Blog ID is required");
  }

  const allComments = await Comments.find({
    blog: blogId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, allComments, "All comments are here."));
});

export const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { newComment } = req.body;

  const authUser = req.user;

  const user = await User.findById(authUser._id);

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (!commentId) {
    throw new ApiError(400, "Comment ID is required");
  }

  const comment = await Comments.findOneAndUpdate(
    {
      _id: commentId,
      createdBy: user._id,
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
    throw new ApiError(400, "Comment ID is required");
  }

  const authUser = req.user;

  const user = await User.findById(authUser._id);

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  const deletedComment = await Comments.findByIdAndDelete(commentId);
  if (!deletedComment) {
    throw new ApiError(404, "Comment not found or unauthorized");
  }

  return res.status(201).json(new ApiResponse(201, null, "COMMENT DELETED"));
});
