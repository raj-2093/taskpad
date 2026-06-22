import { Router } from "express";
import { adminOnly, authenticateUser } from "../middlewares/auth.middlewares.js";
import { createTask, deleteTask, getDashboardData, getTaskById, getTasks, getUserDashboardData, updateTask, updateTaskChecklist, updateTaskStatus } from "../controllers/task.controllers.js";

export const taskRoutes = Router();

taskRoutes.get("/dashboard-data", authenticateUser, getDashboardData);
taskRoutes.get("/user-dashboard-data", authenticateUser, getUserDashboardData);
taskRoutes.get("/", authenticateUser, getTasks);
taskRoutes.get("/:id", authenticateUser, getTaskById);
taskRoutes.post("/", authenticateUser, adminOnly, createTask);
taskRoutes.put("/:id", authenticateUser, updateTask);
taskRoutes.delete("/:id", authenticateUser, adminOnly, deleteTask);
taskRoutes.put("/:id/status", authenticateUser, updateTaskStatus);
taskRoutes.put("/:id/todo", authenticateUser, updateTaskChecklist);