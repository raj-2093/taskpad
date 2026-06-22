import express from "express";
import cors from "cors";
import path from "path";
import { userRoutes } from "./routes/user.routes.js";
import { reportRoutes } from "./routes/report.routes.js";
import { taskRoutes } from "./routes/task.routes.js";
import { authRoutes } from "./routes/auth.routes.js";

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/tasks", taskRoutes);

export {app};