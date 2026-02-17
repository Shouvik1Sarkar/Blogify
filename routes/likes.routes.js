import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { likeBlog, likeComment } from "../controllers/like.controllers.js";

const likesRouter = Router();

likesRouter.route("/blogs/:blogId").get(authMiddleware, likeBlog);
likesRouter.route("/comments/:commentId").get(authMiddleware, likeComment);

export default likesRouter;
