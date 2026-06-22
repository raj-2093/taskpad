import { Router } from "express";
import { adminOnly, authenticateUser } from "../middlewares/auth.middlewares.js";
import { 
    // deleteUser,
    getUserById, 
    getUsers 
} from "../controllers/user.controllers.js";

export const userRoutes = Router();

userRoutes.get("/", authenticateUser, adminOnly, getUsers);
userRoutes.get("/", authenticateUser, getUserById);

// userRoutes.delete("/:id", authenticateUser, adminOnly, deleteUser);