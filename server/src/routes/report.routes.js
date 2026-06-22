import { Router } from "express";
import { adminOnly, authenticateUser } from "../middlewares/auth.middlewares.js";
import { exportTasksReport, exportUsersReport } from "../controllers/report.controllers.js";

export const reportRoutes = Router();

reportRoutes.get("/export/tasks", authenticateUser, adminOnly, exportTasksReport);
reportRoutes.get("/export/users", authenticateUser, adminOnly, exportUsersReport);