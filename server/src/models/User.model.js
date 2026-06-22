import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    console.log(`Error at userSchema.pre("save" bcrypt: ${error}`);
  }
});

userSchema.methods.generateAccessToken = function () {
  try {
    const accessToken = jwt.sign(
      {
        id: this._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      },
    );

    return accessToken;
  } catch (error) {
    console.log(`Error at userSchema.methods.generateAccessToken: ${error}`);
  }
};

userSchema.methods.generateRefreshToken = function () {
  try {
    const refreshToken = jwt.sign(
      {
        id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      },
    );

    return refreshToken;
  } catch (error) {
    console.log(`Error at userSchema.methods.generateRefreshToken: ${error}`);
  }
};

userSchema.methods.isPasswordCorrect = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log(`Error at userSchema.methods.isPasswordCorrect: ${error}`);
  }
};

export const User = mongoose.model("User", userSchema);
