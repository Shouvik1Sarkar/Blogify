import express from "express";
import { findTagPost } from "../controllers/searchByTags.controller.js";

const tagRouter = express.Router();

tagRouter.get("/:tagName", findTagPost);

export default tagRouter;
