import User from "../models/user.models.js";
import ApiError from "../utils/ApiError.utils.js";
import crypto from "crypto";
import { ApiResponse } from "../utils/ApiResponse.utils.js";

import {
  emailSend,
  emailVerificationMail,
  logInMail,
  forgotPasswordMail,
} from "../utils/mail.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

export async function reigsterUser(req, res) {
  const { fullName, userName, email, password } = req.body;

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    console.log("YYYYYYYYY", existedUser.isEmailVerified);
    if (!existedUser.isEmailVerified) {
      throw new ApiError(400, "Verify you email.");
    } else {
      throw new ApiError(400, "User Already exists. LogIn ");
    }
  }

  const user = await User.create({
    fullName,
    userName,
    email,
    password,
  });

  if (!user) {
    throw new ApiError(400, "User not created ");
  }
  const { unhashedToken, hashedToken, expiresIn } =
    user.generateEmailVerificationToken();
  console.log("VERIFICATION URL", unhashedToken);

  await user.save({ validateBeforeSave: false });
  const verification_url = `http://localhost:5500/api/v1/auth/validate/${unhashedToken}`;
  const mailGenContent = await emailVerificationMail(
    user.userName,
    verification_url,
  );

  await emailSend({
    email: user.email,
    subject: "This is subject",
    mailGenContent,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Created Successfully"));
}

export async function validateEmail(req, res) {
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  console.log("HASHED tOKEN", hashedToken);

  // const user = await User.findOne({
  //   emailVerificationToken: hashedToken,
  // });
  const user = await User.findOne({
    $and: [
      { emailVerificationToken: hashedToken },
      { emailVerificationTokenExpiry: { $gt: Date.now() } },
    ],
  });
  if (!user) {
    throw new ApiError(500, "User not found");
  }

  user.isEmailVerified = true;
  await user.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(200, user, "USER VERIFIED"));
}

export const logInUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw new ApiError(500, "User not found");
  }

  const isPass = await user.comparePassword(password);
  if (!isPass) {
    throw new ApiError(401, "Wrong password");
  }

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.accessToken = accessToken;
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 60 minutes
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken)
    .json(new ApiResponse(200, user, "USER LOGGEDIN"));
});

export const logOutUser = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(500, "User Not found");
  }

  const loggedOutUser = await User.findOneAndUpdate(user._id, {
    $unset: {
      accessToken: 1,
      refreshToken: 1,
      refreshTokenExpiry: 1,
      accessTokenExpiresIn: 1,
    },
  });

  await loggedOutUser.save({ validateBeforeSave: false });

  return res
    .status(201)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, loggedOutUser, "User Logged Out"));
});

export const getUser = asyncHandler(async (req, res) => {
  const user = req.user;
  console.log("USER: ", user);
  if (!user) {
    throw new ApiError(500, "NOT LOGGEDIN");
  }

  return res.status(200).json(new ApiResponse(200, user, "THIS IS USER"));
});
