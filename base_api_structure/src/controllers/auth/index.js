import jwt from "jsonwebtoken";
import { User } from "../../models";
import { success, badRequest, internalServerError } from "../../helpers";

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return badRequest(res, "User already exists");
    }

    const user = await User.create({ username, email, password });
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    success(res, "User registered successfully", {
      accessToken,
      refreshToken
    });
  } catch (error) {
    internalServerError(res, "Registration failed");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return badRequest(res, "Invalid credentials");
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    success(res, "Login Successful", {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    internalServerError(res, "Login failed");
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return badRequest(res, "Refresh token is required");
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return badRequest(res, "Invalid refresh token");
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    success(res, "Token refreshed successfully", {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    badRequest(res, "Invalid refresh token");
  }
};