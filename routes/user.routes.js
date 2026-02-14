import express from "express";

import {
  registrationValidation,
  resetForgotPasswordValidation,
} from "../validate/index.js";
import validateMiddleware from "../middleware/validators.middlewares.js";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  changePassword,
  forgotPassword,
  getUser,
  resetForgottenPassword,
  resetPassword,
} from "../controllers/user.controllers.js";

const userRouter = express.Router();

userRouter.route("/get").get(authMiddleware, getUser);

export default userRouter;
