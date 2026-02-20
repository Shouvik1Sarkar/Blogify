import Follow from "../models/follow.models.js";
import User from "../models/user.models.js";
import ApiError from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

export const follow = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = req.user;
  //   console.log("XXXXXXXXXXXXX ", user);
  if (!user) {
    throw new ApiError(401, "UnAuthorized");
  }
  if (user._id.toString() === userId) {
    throw new ApiError(400, "You cannot follow yourself");
  }
  const following = await User.findById(userId);

  if (!following) {
    throw new ApiError(404, "User not found");
  }

  let followed;
  let message;
  const existing_follower = await Follow.findOne({
    follower: user._id,
    following: userId,
  });

  if (existing_follower) {
    await existing_follower.deleteOne();
    followed = false;
    message = "Unfollowed";
  } else {
    await Follow.create({
      follower: user._id,
      following: userId,
    });
    followed = true;
    message = "Followed";
  }

  return res.status(200).json(new ApiResponse(200, followed, message));
});

export const allFollowing = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const following = await User.findById(userId);

  const user = req.user;
  if (!user) {
    throw new ApiError(401, "UnAuthorized");
  }

  if (!following) {
    throw new ApiError(404, "User not found");
  }

  const followingUsers = await Follow.find({
    follower: userId,
  })
    .populate("following", "userName email cover_image")
    .select("-follower -__v");

  const followinCounts = await Follow.countDocuments({
    follower: userId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      { following: followingUsers, count: followinCounts },

      "user all following",
    ),
  );
});

export const allFollowers = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = req.user;
  if (!user) {
    throw new ApiError(401, "UnAuthorized");
  }

  const following = await User.findById(userId);

  if (!following) {
    throw new ApiError(404, "User not found");
  }

  const followers = await Follow.find({
    following: userId,
  })
    .populate("follower", "userName email cover_image")
    .select("-following -__v");

  const followinCounts = await Follow.countDocuments({
    following: userId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      { followers: followers, count: followinCounts },

      "all followers",
    ),
  );
});
