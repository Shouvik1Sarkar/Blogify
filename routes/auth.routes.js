import express from "express";
import { reigsterUser } from "../controllers/auth.controllers.js";
import { registrationValidation } from "../validate/index.js";
import validateMiddleware from "../middleware/validators.middlewares.js";

const authRouter = express.Router();

authRouter
  .route("/register")
  .post(registrationValidation(), validateMiddleware, reigsterUser);
// authRouter.post("/register", reigsterUser);

export default authRouter;
