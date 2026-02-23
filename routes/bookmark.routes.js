import express from "express";
import {
  bookMarkBlog,
  getUserBookMarked,
} from "../controllers/book.controllers.js";
import authMiddleware from "../middleware/auth.middleware.js";

const bookmarkRouter = express.Router();

bookmarkRouter.get("/getAll", authMiddleware, getUserBookMarked);
bookmarkRouter.get("/:blogId", authMiddleware, bookMarkBlog);

export default bookmarkRouter;
