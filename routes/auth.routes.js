import express from "express";
import { reigsterUser } from "../controllers/auth.controllers.js";

const authRouter = express.Router();

authRouter.route("/register").post(reigsterUser);
// authRouter.post("/register", reigsterUser);

export default authRouter;
