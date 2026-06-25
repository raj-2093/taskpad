import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const authenticateUser = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if(!token) {
            return res.status(401).json(new ApiResponse(401, "No token provided", {}));
        }

        if(token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req["user"] = await User.findById(decoded.id).select("-password -refreshToken");

            next();
        }

    } catch(error) {
        console.log(`Error at authenticateUser: ${error}`);
        return res.status(401).json(new ApiResponse(401, `Token Failed: ${error.message}`, {}));
    }
};

const adminOnly = (req, res, next) => {
    if(req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json(new ApiResponse(403, "Access denied, admin only"));
    }
}

export {adminOnly, authenticateUser};