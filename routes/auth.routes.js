import express from "express";
import {
  getUser,
  logInUser,
  reigsterUser,
  validateEmail,
} from "../controllers/auth.controllers.js";
import { registrationValidation } from "../validate/index.js";
import validateMiddleware from "../middleware/validators.middlewares.js";
import authMiddleware from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter
  .route("/register")
  .post(registrationValidation(), validateMiddleware, reigsterUser);
authRouter.route("/validate/:token").get(validateEmail);

authRouter.route("/logIn").post(logInUser);
authRouter.get("/get", authMiddleware, getUser);

export default authRouter;
