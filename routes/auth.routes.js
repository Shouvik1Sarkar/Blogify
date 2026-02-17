import express from "express";
import {
  resetPassword,
  changeForgottenPassword,
  logInUser,
  logOutUser,
  registerUser,
  resetPasswordSendOtp,
  validateEmail,
  forgotPassword,
} from "../controllers/auth.controllers.js";
import {
  changeForgotPasswordValidation,
  registrationValidation,
} from "../validate/index.js";
import validateMiddleware from "../middleware/validators.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  upload.single("cover_image"),
  registrationValidation(),
  validateMiddleware,
  registerUser,
);

authRouter.get("/verify-email/:token", validateEmail);

authRouter.post("/login", logInUser);

authRouter.get("/logout", authMiddleware, logOutUser);

authRouter.post("/forgot-password", forgotPassword);

authRouter.post(
  "/password/change/request",
  authMiddleware,
  resetPasswordSendOtp,
);

// Step 2: Verify OTP & update password
authRouter.post(
  "/password/change/confirm",
  authMiddleware,
  changeForgotPasswordValidation(),
  validateMiddleware,
  resetPassword,
);

export default authRouter;
