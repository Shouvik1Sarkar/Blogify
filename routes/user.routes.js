import express from "express";

import validateMiddleware from "../middleware/validators.middlewares.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { getUser } from "../controllers/user.controllers.js";

const userRouter = express.Router();

userRouter.route("/get").get(authMiddleware, getUser);

export default userRouter;
