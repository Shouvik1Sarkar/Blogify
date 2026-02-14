import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createBlog, getAllBlogs } from "../controllers/blogs.controllers.js";
import { createBlogValidation } from "../validate/blogs.validate.js";
import validateMiddleware from "../middleware/validators.middlewares.js";

const blogRouter = Router();

blogRouter
  .route("/create")
  .post(authMiddleware, createBlogValidation(), validateMiddleware, createBlog);
blogRouter.route("/getAllBlogs").get(authMiddleware, getAllBlogs);

export default blogRouter;
