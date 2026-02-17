import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  deleteComment,
  updateComment,
} from "../controllers/comments.controllers.js";
import {
  updateCommentValidation,
  writeCommentValidation,
} from "../validate/comment.validate.js";
import validateMiddleware from "../middleware/validators.middleware.js";

const commentRouter = Router();

commentRouter
  .route("/update/:commentId/")
  .patch(
    authMiddleware,
    updateCommentValidation(),
    validateMiddleware,
    updateComment,
  );
commentRouter
  .route("/delete/:commentId/")
  .delete(authMiddleware, deleteComment);

export default commentRouter;
