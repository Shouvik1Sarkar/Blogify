import express from "express";

import validateMiddleware from "../middleware/validators.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  deleteProfile,
  getUser,
  updateAvatar,
  updateProfile,
} from "../controllers/user.controllers.js";
import upload from "../middleware/multer.middleware.js";

const userRouter = express.Router();

userRouter.route("/me").get(authMiddleware, getUser);
userRouter.route("/updateProfile").post(authMiddleware, updateProfile);
userRouter
  .route("/updateAvatar")
  .post(upload.single("cover_image"), authMiddleware, updateAvatar);
userRouter.route("/deleteProfile").get(authMiddleware, deleteProfile);

export default userRouter;
