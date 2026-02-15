import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { likeBlog, likeComment } from "../controllers/like.controllers.js";

const likesRouter = Router();

likesRouter.route("/likeBlog/:blogId").get(authMiddleware, likeBlog);
likesRouter.route("/likeComment/:commentId").get(authMiddleware, likeComment);

export default likesRouter;
