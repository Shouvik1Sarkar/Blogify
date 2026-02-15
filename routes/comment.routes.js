import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  deleteComment,
  updateComment,
} from "../controllers/comments.controllers.js";

const commentRouter = Router();

commentRouter
  .route("/updateComment/:commentId/")
  .patch(authMiddleware, updateComment);
commentRouter
  .route("/deleteComment/:commentId/")
  .delete(authMiddleware, deleteComment);

export default commentRouter;
