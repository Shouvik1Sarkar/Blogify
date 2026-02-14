import User from "../models/user.models.js";
import ApiError from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { forgotPasswordMail } from "../utils/mail.js";

export const getUser = asyncHandler(async (req, res) => {
  const user = req.user;
  console.log("USER: ", user);
  if (!user) {
    throw new ApiError(500, "NOT LOGGEDIN");
  }

  return res.status(200).json(new ApiResponse(200, user, "THIS IS USER"));
});

// export const forgotPassword = asyncHandler(async (req, res) => {
//   const { userName, email } = req.body;

//   const user = await User.findOne({
//     $or: [{ userName }, { email }],
//   });

//   if (!user) {
//     throw new ApiError(500, "User Not Found");
//   }

//   const forgotToken = Math.floor(Math.random() * 1000000) + 100000;

//   forgotPasswordMail(user.userName, forgotToken);
//   user.forgotToken = forgotToken;
//   user.forgotTokenExpiry = Date.now() + 20 * 60 * 1000;

//   await user.save({ validateBeforeSave: false });

//   console.log("OTP: ", forgotToken);

//   return res.status(201).json(new ApiResponse(201, user, "OTP SENT"));
// });

// export const resetForgottenPassword = asyncHandler(async (req, res) => {
//   const { forgotToken, newPassword, confirmNewPassword } = req.body;

//   const user = await User.findOne({
//     $and: [{ forgotToken }, { forgotTokenExpiry: { $gt: Date.now() } }],
//   });

//   if (!user) {
//     throw new ApiError(500, "WRONG OTP");
//   }

//   if (newPassword !== confirmNewPassword) {
//     throw new ApiError(500, "Passwords did not match");
//   }

//   user.password = newPassword;
//   console.log("0000000000000000", user.userName);

//   await user.save();

//   return res
//     .status(201)
//     .json(new ApiResponse(201, user, "Password updated successfully"));
// });

// export const resetPassword = asyncHandler(async (req, res) => {
//   const { password } = req.body;

//   if (!password) {
//     throw new ApiError(500, "PASSWORD IS REQUIROED");
//   }

//   const user = req.user;

//   const isPasswordCoreect = await user.comparePassword(password);

//   if (!isPasswordCoreect) {
//     throw new ApiError(500, "Password did not match");
//   }

//   const forgotToken = Math.floor(Math.random() * 1000000) + 100000;

//   //   forgotPasswordMail(user.userName, forgotToken);
//   user.resetToken = forgotToken;
//   user.resetTokenExpiry = Date.now() + 20 * 60 * 1000;

//   await user.save({ validateBeforeSave: false });

//   console.log("OTP: ", forgotToken);

//   return res.status(201).json(new ApiResponse(201, user, "OTP SENT"));
// });

// export const changePassword = asyncHandler(async (req, res) => {
//   const { newPassword, confirmNewPassword } = req.body;

//   const user = req.user;

//   if (!user) {
//     throw new ApiError(500, "NOT LOGGED IN");
//   }

//   if (newPassword !== confirmNewPassword) {
//     throw new ApiError(500, "Passwords did not match");
//   }

//   user.password = newPassword;
//   console.log("0000000000000000", user.userName);

//   await user.save();

//   return res
//     .status(201)
//     .json(new ApiResponse(201, user, "Password updated successfully"));
// });
