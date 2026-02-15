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
import validateMiddleware from "../middleware/validators.middlewares.js";
import {
  comment,
  commentOfABlog,
} from "../controllers/comments.controllers.js";

const blogRouter = Router();

blogRouter
  .route("/create")
  .post(authMiddleware, createBlogValidation(), validateMiddleware, createBlog);
blogRouter.route("/getAllBlogs").get(authMiddleware, getAllBlogs);
blogRouter.route("/getUserBlogs").get(authMiddleware, getUserBlogs);
blogRouter.route("/getBlog/:id").get(getBlog);
blogRouter.route("/deleteBlog/:id").delete(deleteBlog);

// comment

blogRouter.route("/:blogId/comment/").post(authMiddleware, comment);
blogRouter
  .route("/commentOfABlog/:blogId/")
  .get(authMiddleware, commentOfABlog);

export default blogRouter;
