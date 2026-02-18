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
  .route("/")
  .post(createBlogValidation(), validateMiddleware, authMiddleware, createBlog);
blogRouter.route("/getAllBlogs").get(authMiddleware, getAllBlogs);
blogRouter.route("/:id").get(authMiddleware, getUserBlogs);
blogRouter.route("/getblog/:blogId").get(getBlog);
blogRouter.route("/delete/:id").delete( authMiddleware, deleteBlog);

// comment

blogRouter
  .route("/:blogId/comments")
  .post(authMiddleware, writeCommentValidation(), validateMiddleware, comment);
blogRouter.route("/:blogId/comments").get(authMiddleware, commentOfABlog);

export default blogRouter;
