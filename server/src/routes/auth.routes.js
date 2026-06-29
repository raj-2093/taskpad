import { Router } from "express";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  refresh,
  registerUser,
  updateUserProfile,
} from "../controllers/auth.controllers.js";
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { upload } from "../middlewares/upload.middlewares.js";
import { cloudinaryInstance } from "../utils/cloudinaryConfig.js";

export const authRoutes = Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/refresh", refresh);
authRoutes.get("/profile", authenticateUser, getUserProfile);
authRoutes.put("/profile", authenticateUser, updateUserProfile);
authRoutes.post("/logout", authenticateUser, logoutUser);

authRoutes.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(new ApiResponse(400, "No file uploaded", {}));
    }

    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinaryInstance.uploader.upload_stream(
          { folder: 'express_uploads' }, // Optional: specify a folder name
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const result = await streamUpload(req);

    res.status(200).json(new ApiResponse(200, "Upload successful", {
      imageUrl: result.secure_url,
    }));
  } catch (error) {
    console.error(`Error at authRoutes.post("/upload-image"): ${error}`);
    res.status(500).json(
      new ApiResponse(500, "Upload failed", {
        details: error.message,
      }),
    );
  }
//   if (!req.file) {
//     return res.status(400).json(new ApiResponse(400, "No file uploaded", {}));
//   }

//   const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

//   return res.status(200).json(
//     new ApiResponse(200, "image uploaded successfully", {
//       imageUrl,
//     }),
//   );
});
