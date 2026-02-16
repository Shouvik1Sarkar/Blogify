import bcrypt from "bcryptjs";
import ApiError from "../utils/ApiError.utils.js";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

async function authMiddleware(req, res, next) {
  const cookieToken = req.cookies?.accessToken;
  console.log("COOKIES:---- ", cookieToken);
  if (!cookieToken) {
    throw new ApiError(500, "Not loggedIn cookie not here");
  }

  const retrievedUser = await jwt.verify(
    cookieToken,
    process.env.ACCESS_TOKEN_SECRET,
  );

  if (!retrievedUser) {
    return next();
    // throw new ApiError(500, "User not found");
  }

  const user = await User.findById(retrievedUser._id).select("+password");

  if (!user) {
    throw new ApiError(500, "User not found---");
  }

  // if (!user.isEmailVerified) {
  // }

  req.user = user;

  return next();
}

export default authMiddleware;
