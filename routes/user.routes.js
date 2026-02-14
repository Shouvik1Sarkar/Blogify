import express from "express";

import validateMiddleware from "../middleware/validators.middlewares.js";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  deleteProfile,
  getUser,
  updateProfile,
} from "../controllers/user.controllers.js";

const userRouter = express.Router();

userRouter.route("/get").get(authMiddleware, getUser);
userRouter.route("/updateProfile").post(authMiddleware, updateProfile);
userRouter.route("/deleteProfile").get(authMiddleware, deleteProfile);

export default userRouter;
