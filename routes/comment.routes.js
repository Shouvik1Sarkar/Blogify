import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  deleteComment,
  updateComment,
} from "../controllers/comments.controllers.js";
import { writeCommentValidation } from "../validate/comment.validate.js";
import validateMiddleware from "../middleware/validators.middlewares.js";

const commentRouter = Router();

commentRouter
  .route("/updateComment/:commentId/")
  .patch(
    authMiddleware,
    writeCommentValidation(),
    validateMiddleware,
    updateComment,
  );
commentRouter
  .route("/deleteComment/:commentId/")
  .delete(authMiddleware, deleteComment);

export default commentRouter;
