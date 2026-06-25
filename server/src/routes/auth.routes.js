import { Router } from "express";
import { getUserProfile, loginUser, logoutUser, refresh, registerUser, updateUserProfile } from "../controllers/auth.controllers.js";
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { upload } from "../middlewares/upload.middlewares.js";

export const authRoutes = Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/refresh", refresh);
authRoutes.get("/profile", authenticateUser, getUserProfile);
authRoutes.put("/profile", authenticateUser, updateUserProfile);
authRoutes.post("/logout", authenticateUser, logoutUser);

authRoutes.post("/upload-image", upload.single("image"), (req, res) => {
    if(!req.file) {
        return res.status(400).json(new ApiResponse(400, "No file uploaded", {}));
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    return res.status(200).json(new ApiResponse(200, "image uploaded successfully", {
        imageUrl
    }));
})