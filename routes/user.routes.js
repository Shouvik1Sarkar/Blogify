import express from "express";

import {
  registrationValidation,
  resetForgotPasswordValidation,
} from "../validate/index.js";
import validateMiddleware from "../middleware/validators.middlewares.js";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  forgotPassword,
  getUser,
  resetForgottenPassword,
} from "../controllers/user.controllers.js";

const userRouter = express.Router();

userRouter.route("/get").get(authMiddleware, getUser);
userRouter.route("/forgotPassword").post(forgotPassword);
userRouter
  .route("/resetForgottenPassword")
  .post(
    resetForgotPasswordValidation(),
    validateMiddleware,
    resetForgottenPassword,
  );
export default userRouter;
