import express from "express";
import { PORT, MONGODB_URI } from "./config/env.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
// Import Variables

import connect_db from "./connection/db.js";

// global middlewares

import globalError from "./middleware/globalError.middleware.js";

// import routes

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blogs.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likesRoutes from "./routes/likes.routes.js";
import playListRouter from "./routes/playList.routes.js";

const app = express();

app.use(express.json());

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use()

app.use(
  cors({
    origin: "http://localhost:5173", // typical Vite
    credentials: true,
  }),
);

// connect_db(MONGODB_URI);

app.get("/", (req, res) => res.send("THIS IS IT"));

app.use("/api/v1/auth/", authRouter);
app.use("/api/v1/user/", userRouter);
app.use("/api/v1/blog/", blogRouter);
app.use("/api/v1/comment/", commentRouter);
app.use("/api/v1/like/", likesRoutes);
app.use("/api/v1/playList/", playListRouter);

app.use(globalError);

// ===== Server Startup =====
const startServer = async () => {
  try {
    await connect_db(MONGODB_URI);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1);
  }
};

startServer();
