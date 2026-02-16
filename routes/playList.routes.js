import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createPlayList } from "../controllers/playList.controllers.js";
import { createPlayListValidation } from "../validate/blogs.validate.js";

const playListRouter = Router();

playListRouter
  .route("/create")
  .post(createPlayListValidation(), authMiddleware, createPlayList);

export default playListRouter;
