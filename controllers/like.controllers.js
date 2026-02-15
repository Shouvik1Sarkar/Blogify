import Comments from "../models/comments.models.js";
import Likes from "../models/likes.models.js";
import ApiError from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

export const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const users = req.user;

  if (!blogId) {
    throw new ApiError(400, "Blog not found.");
  }

  const existingLike = await Likes.findOne({
    targetId: blogId,
    user: users._id,
    targetType: "Blog",
  });
  let liked;
  if (existingLike) {
    await existingLike.deleteOne();
    liked = false;
    console.log("DELETED: ");
  } else {
    const like = await Likes.create({
      targetId: blogId,
      user: users._id,
      targetType: "Blog",
    });
    liked = true;
  }

  const totalLikes = await Likes.countDocuments({
    targetId: blogId,
    targetType: "Blog",
  });
  console.log("LIKE COUNDT", totalLikes);
  return res
    .status(200)
    .json(new ApiResponse(200, [liked, totalLikes], "Liked The blog"));
});

export const likeComment = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(500, "Not Logged In");
  }

  const { commentId } = req.params;

  const existedLike = await Likes.findOne({
    targetId: commentId,
    user: user._id,
    targetType: "Comment",
  });
  let liked;
  if (existedLike) {
    await existedLike.deleteOne();
    liked = false;
  } else {
    await Likes.create({
      targetId: commentId,
      user: user._id,
      targetType: "Comment",
    });

    liked = true;
  }

  const likeCounts = await Likes.countDocuments({
    targetId: commentId,
    targetType: "Comment",
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        [{ liked: liked }, { likeCounts: likeCounts }],
        "Liked the comment",
      ),
    );
});
