import express from "express";
import {
  allFollowers,
  allFollowing,
  follow,
  followFeed,
} from "../controllers/follow.controllers.js";
import authMiddleware from "../middleware/auth.middleware.js";

const followRouter = express.Router();

followRouter.get("/followFeed", authMiddleware, followFeed);
followRouter.get("/:userId", authMiddleware, follow);
followRouter.get("/followings/:userId", authMiddleware, allFollowing);
followRouter.get("/followers/:userId", authMiddleware, allFollowers);

export default followRouter;
