import express from "express";
import { PORT, MONGODB_URI } from "./config/env.js";

// Import Variables

import connect_db from "./connection/db.js";
import authRouter from "./routes/auth.routes.js";

// global middlewares

import globalError from "./middleware/globalError.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use()

connect_db(MONGODB_URI);

app.get("/", (req, res) => res.send("THIS IS IT"));

app.use("/api/v1/auth/", authRouter);

app.use(globalError);

app.listen(PORT, () => console.log("Example app running at port:", PORT));
