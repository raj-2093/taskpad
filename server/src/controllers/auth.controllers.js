import { User } from "../models/User.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { STATUS_CODE } from "../utils/constants.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return {
      accessToken,
      refreshToken
    }
  } catch(error) {
    console.log(`Error at generateAccessAndRefreshTokens: ${error}`);
  }
}

const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    profileImageUrl,
    adminInviteToken
  } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({email});
  if(userExists) return res.status(400).json(new ApiResponse(400, "User already exists"));

  // Determin user role
  let role = "member";
  if(adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN) role = "admin";

  const user = await User.create({
    name,
    email,
    password,
    profileImageUrl,
    role,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  const {
    refreshToken,
    accessToken
  } = await generateAccessAndRefreshTokens(user._id);

  return res
  .cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 30*24*60*60*1000
  })
  .status(STATUS_CODE.RESOURCE_CREATED)
  .json(new ApiResponse(STATUS_CODE.RESOURCE_CREATED, "User created successfully", {
    createdUser,
    accessToken
  }));

}, "registerUser");

const loginUser = asyncHandler(async (req, res) => {
  const {
    email,
    password
  } = req.body;

  const user = await User.findOne({ email });

  if(!user) return res.status(STATUS_CODE.RESOURCE_UNAUTHORIZED).json(new ApiResponse(STATUS_CODE.RESOURCE_UNAUTHORIZED, "Invalid email or password", {}));

  if(!user.isPasswordCorrect(password)) return res.status(STATUS_CODE.RESOURCE_UNAUTHORIZED).json(new ApiResponse(STATUS_CODE.RESOURCE_UNAUTHORIZED, "Invalid email or password", {}));

  const {
    refreshToken,
    accessToken
  } = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  return res
  .cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 30*24*60*60*1000
  })
  .status(STATUS_CODE.RESOURCE_CREATED)
  .json(new ApiResponse(STATUS_CODE.RESOURCE_CREATED, "User logged in successfully", {
    loggedInUser,
    accessToken
  }));

}, "loginUser");

const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken) return res.status(STATUS_CODE.RESOURCE_UNAUTHORIZED).json(new ApiResponse(STATUS_CODE.RESOURCE_UNAUTHORIZED, "No refresh token provided", {}));

  const { id } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  if(!id) return res.status(STATUS_CODE.RESOURCE_UNAUTHORIZED).json(new ApiResponse(STATUS_CODE.RESOURCE_UNAUTHORIZED, "Invalid refresh token", {}));

  const {
    refreshToken: newRefreshToken,
    accessToken
  } = await generateAccessAndRefreshTokens(id);

  return res
  .cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    maxAge: 30*24*60*60*1000
  })
  .status(STATUS_CODE.RESOURCE_CREATED)
  .json(new ApiResponse(STATUS_CODE.RESOURCE_CREATED, "Tokens refreshed successfully", {
    accessToken
  }));
}, "refresh");

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -refreshToken");

  if(!user) return res.status(STATUS_CODE.RESOURCE_NOT_FOUND).json(new ApiResponse(STATUS_CODE.RESOURCE_NOT_FOUND, "User not found"));

  return res.status(STATUS_CODE.RESOURCE_FETCHED).json(new ApiResponse(STATUS_CODE.RESOURCE_FETCHED, "User found and sent successfully", {
    user
  }));
}, "getUserProfile");

const updateUserProfile = asyncHandler(
  async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(STATUS_CODE.RESOURCE_NOT_FOUND).json(new ApiResponse(STATUS_CODE.RESOURCE_NOT_FOUND, "User not found"));
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(STATUS_CODE.RESOURCE_UPDATED).json(new ApiResponse(STATUS_CODE.RESOURCE_UPDATED, "User updated successfully", {
      updatedUser
    }));
  },
  "updateUserProfile",
);

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken");
  return res.status(STATUS_CODE.RESOURCE_DELETED).json(new ApiResponse(STATUS_CODE.RESOURCE_DELETED, "User logged out successfully", {}));
}, "logoutUser");

export { registerUser, loginUser, getUserProfile, updateUserProfile, refresh, logoutUser };
