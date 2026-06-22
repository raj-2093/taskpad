import { Task } from "../models/Task.model.js";
import { User } from "../models/User.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { STATUS_CODE } from "../utils/constants.js";

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "member" }).select(
    "-password -refreshToken",
  );

  const usersWithTaskCounts = await Promise.all(
    users.map(async (user) => {
      const pendingTasks = await Task.countDocuments({
        assignedTo: user._id,
        status: "Pending",
      });
      const inProgressTasks = await Task.countDocuments({
        assignedTo: user._id,
        status: "In Progress",
      });
      const completedTasks = await Task.countDocuments({
        assignedTo: user._id,
        status: "Completed",
      });

      return {
        ...user._doc,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      };
    }),
  );

  return res.status(STATUS_CODE.RESOURCE_FETCHED).json(
    new ApiResponse(STATUS_CODE.RESOURCE_FETCHED, "Users fetched successfully", {
      users: usersWithTaskCounts,
    }),
  );
}, "getUsers");

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if(!user) return res.status(STATUS_CODE.RESOURCE_NOT_FOUND).json(new ApiResponse(STATUS_CODE.RESOURCE_NOT_FOUND, "User not found", {}));
    return res.status(STATUS_CODE.RESOURCE_FETCHED).json(new ApiResponse(STATUS_CODE.RESOURCE_FETCHED, "User fetched successfully", {
        user
    }));
}, "getUserById");

// const deleteUser = asyncHandler(async (req, res) => {}, "deleteUser");

export { 
    getUsers,
    getUserById, 
    // deleteUser 
};
