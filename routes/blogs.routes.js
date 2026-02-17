import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlog,
  getUserBlogs,
} from "../controllers/blogs.controllers.js";
import { createBlogValidation } from "../validate/blogs.validate.js";
import validateMiddleware from "../middleware/validators.middleware.js";
import {
  comment,
  commentOfABlog,
} from "../controllers/comments.controllers.js";
import { writeCommentValidation } from "../validate/comment.validate.js";

const blogRouter = Router();

blogRouter
  .route("/create")
  .post(createBlogValidation(), validateMiddleware, authMiddleware, createBlog);
blogRouter.route("/getAllBlogs").get(authMiddleware, getAllBlogs);
blogRouter.route("/:userId/getUserBlogs").get(authMiddleware, getUserBlogs);
blogRouter.route("/getBlog/:id").get(getBlog);
blogRouter.route("/deleteBlog/:id").delete(deleteBlog);

// comment

blogRouter
  .route("/:blogId/comment/")
  .post(authMiddleware, writeCommentValidation(), validateMiddleware, comment);
blogRouter
  .route("/commentOfABlog/:blogId/")
  .get(authMiddleware, commentOfABlog);

export default blogRouter;
