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

authRouter
  .route("/register")
  .post(
    upload.single("cover_image"),
    registrationValidation(),
    validateMiddleware,
    registerUser,
  );
authRouter.route("/validate/:token").get(validateEmail);

authRouter.route("/logIn").post(logInUser);

authRouter.get("/logOut", authMiddleware, logOutUser);

authRouter.route("/forgotPassword").post(forgotPassword);
authRouter
  .route("/resetForgottenPassword")
  .post(
    changeForgotPasswordValidation(),
    validateMiddleware,
    changeForgottenPassword,
  );
authRouter.route("/resetPassword").post(authMiddleware, resetPasswordSendOtp);
authRouter
  .route("/changePassword")
  .post(
    changeForgotPasswordValidation(),
    validateMiddleware,
    authMiddleware,
    resetPassword,
  );

export default authRouter;
