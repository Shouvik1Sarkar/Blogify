import Blog from "../models/blog.models.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

export const findTagPost = asyncHandler(async (req, res) => {
  const { tagName } = req.params;
  const post = await Blog.aggregate([
    {
      $match: {
        tags: tagName,
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(201, post, `All posts containing ${tagName}`));
});
