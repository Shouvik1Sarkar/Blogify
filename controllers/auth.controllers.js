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
import uploadImage from "../utils/cloudinary.utils.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, userName, email, password } = req.body;
  const cover_image = req.file?.path;

  const uploadPath = await uploadImage(cover_image);

  console.log("upload path", uploadPath);

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    // console.log("YYYYYYYYY", existedUser.isEmailVerified);
    if (!existedUser.isEmailVerified) {
      throw new ApiError(403, "Verify you email.");
    } else {
      throw new ApiError(409, "User Already exists. LogIn ");
    }
  }

  const user = await User.create({
    fullName,
    userName,
    email,
    password,
    cover_image: uploadPath,
  });

  if (!user) {
    throw new ApiError(500, "User could not be created.");
  }
  const { unhashedToken, hashedToken, expiresIn } =
    user.generateEmailVerificationToken();

  await user.save({ validateBeforeSave: false });
  const verification_url = `http://localhost:5500/api/v1/auth/validate/${unhashedToken}`;
  // const mailGenContent = await emailVerificationMail(
  //   user.userName,
  //   verification_url,
  // );

  console.log("VERIFICATION URL", verification_url);
  // await emailSend({
  //   email: user.email,
  //   subject: "This is subject",
  //   mailGenContent,
  // });

  console.log("-----", user.emailVerificationToken);
  // console.log("-----", user.emailVerificationTokenExpiry);

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User Created Successfully"));
});

export const validateEmail = asyncHandler(async (req, res) => {
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
    throw new ApiError(400, "Invalid or expired verification token.");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpiry = undefined;
  await user.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(200, user, "USER VERIFIED"));
});

export const logInUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  const user = await User.findOne({
    $or: [{ userName }, { email }],
  }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!user.isEmailVerified) {
    throw new ApiError(403, "Please verify your email first.");
  }

  const isPass = await user.comparePassword(password);
  if (!isPass) {
    throw new ApiError(401, "Wrong password");
  }

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 60 minutes
  };
  const userObj = user.toObject();
  delete userObj.password;
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, userObj, "USER LOGGEDIN"));
});

export const logOutUser = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  const loggedOutUser = await User.findByIdAndUpdate(user._id, {
    $unset: {
      accessToken: 1,
      refreshToken: 1,
      refreshTokenExpiry: 1,
      accessTokenExpiresIn: 1,
    },
  });

  await loggedOutUser.save({ validateBeforeSave: false });

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, loggedOutUser, "User Logged Out"));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { userName, email } = req.body;

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const forgotToken = crypto.randomInt(100000, 999999);

  // const mailGenContent = await forgotPasswordMail(user.userName, forgotToken);
  user.forgotToken = forgotToken;
  user.forgotTokenExpiry = Date.now() + 20 * 60 * 1000;

  // await emailSend({
  //   email: user.email,
  //   subject: "This is subject",
  //   mailGenContent,
  // });

  await user.save({ validateBeforeSave: false });

  console.log("OTP: ", forgotToken);

  return res.status(200).json(new ApiResponse(200, user, "OTP SENT"));
});

export const changeForgottenPassword = asyncHandler(async (req, res) => {
  const { forgotToken, newPassword, confirmNewPassword } = req.body;

  const hashedForgotToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  const user = await User.findOne({
    $and: [
      { forgotToken: hashedForgotToken },
      { forgotTokenExpiry: { $gt: Date.now() } },
    ],
  });

  if (!user) {
    throw new ApiError(400, "WRONG OTP");
  }

  if (newPassword !== confirmNewPassword) {
    throw new ApiError(400, "Passwords did not match");
  }

  user.password = newPassword;
  user.forgotToken = undefined;
  user.forgotTokenExpiry = undefined;
  // console.log("0000000000000000", user.userName);

  await user.save();
  user.password = undefined;

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Password updated successfully"));
});

export const resetPasswordSendOtp = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const authUser = req.user;
  // console.log("USER: ", authUser);

  const user = await User.findById(authUser._id).select("+password");

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  const isPasswordCoreect = await user.comparePassword(password);

  if (!isPasswordCoreect) {
    throw new ApiError(401, "Invalid credentials");
  }

  const forgotToken = crypto.randomInt(100000, 999999);

  // const mailGenContent = await forgotPasswordMail(user.userName, forgotToken);
  user.resetToken = forgotToken;
  user.resetTokenExpiry = Date.now() + 20 * 60 * 1000;

  // await emailSend({
  //   email: user.email,
  //   subject: "Fot got password",
  //   mailGenContent,
  // });

  await user.save({ validateBeforeSave: false });

  console.log("OTP: ", forgotToken);

  return res.status(200).json(new ApiResponse(200, user, "OTP SENT"));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  if (!otp) {
    throw new ApiError(400, "Otp not here");
  }

  const otps = crypto.createHash("sha256").update(otp).digest("hex");

  const isUsOtp = await User.findOne({
    $and: [{ resetToken: otps }, { resetTokenExpiry: { $gt: Date.now() } }],
  });

  if (!isUsOtp) {
    throw new ApiError(400, "Otp not match ");
  }

  const authUser = req.user;
  // console.log("USER: ", authUser);

  const user = await User.findById(authUser._id);
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  const { newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  user.password = newPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  // console.log("0000000000000000", user.userName);

  await user.save();
  user.password = undefined;

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Password updated successfully"));
});
