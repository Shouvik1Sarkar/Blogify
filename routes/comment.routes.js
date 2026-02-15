import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { updateComment } from "../controllers/blogs.controllers.js";

const commentRouter = Router();

commentRouter
  .route("/updateComment/:commentId/")
  .patch(authMiddleware, updateComment);

export default commentRouter;
