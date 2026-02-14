import express from "express";
import { PORT, MONGODB_URI } from "./config/env.js";
import cookieParser from "cookie-parser";

// Import Variables

import connect_db from "./connection/db.js";

// global middlewares

import globalError from "./middleware/globalError.middleware.js";

// import routes

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blogs.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use()

connect_db(MONGODB_URI);

app.get("/", (req, res) => res.send("THIS IS IT"));

app.use("/api/v1/auth/", authRouter);
app.use("/api/v1/user/", userRouter);
app.use("/api/v1/blog/", blogRouter);

app.use(globalError);

app.listen(PORT, () => console.log("Example app running at port:", PORT));
