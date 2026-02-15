import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { likeBlog } from "../controllers/like.controllers.js";

const likesRouter = Router();

likesRouter.route("/likeBlog/:blogId").get(authMiddleware, likeBlog);

export default likesRouter;
