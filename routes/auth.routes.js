import express from "express";
import {
  changeForgottenPassword,
  changePassword,
  logInUser,
  logOutUser,
  reigsterUser,
  resetPasswordSendOtp,
  validateEmail,
} from "../controllers/auth.controllers.js";
import {
  changeForgotPasswordValidation,
  registrationValidation,
} from "../validate/index.js";
import validateMiddleware from "../middleware/validators.middlewares.js";
import authMiddleware from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter
  .route("/register")
  .post(registrationValidation(), validateMiddleware, reigsterUser);
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
    changePassword,
  );

export default authRouter;
