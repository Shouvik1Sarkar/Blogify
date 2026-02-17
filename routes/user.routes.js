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

// get my profile
userRouter.route("/me").get(authMiddleware, getUser);

// Update profile (name, bio etc.)
userRouter.patch("/me", authMiddleware, updateProfile);

// Update avatar
userRouter.patch(
  "/me/avatar",
  authMiddleware,
  upload.single("cover_image"),
  updateAvatar,
);

// Delete account
userRouter.delete("/me/delete", authMiddleware, deleteProfile);

export default userRouter;
