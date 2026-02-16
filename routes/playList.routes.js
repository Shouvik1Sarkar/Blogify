import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  allBlogsOfPlayList,
  createPlayList,
} from "../controllers/playList.controllers.js";
import { createPlayListValidation } from "../validate/blogs.validate.js";
import { createBlog } from "../controllers/blogs.controllers.js";

const playListRouter = Router();

playListRouter
  .route("/create")
  .post(createPlayListValidation(), authMiddleware, createPlayList);
playListRouter
  .route("/:playListId/createBlog")
  .post(authMiddleware, createBlog);
playListRouter.route("/:playListId/allBlogsOfPlayList").get(allBlogsOfPlayList);

// playListRouter
//   .route("/:playListId/createBlog")
//   .post(authMiddleware, createBlog);

export default playListRouter;
