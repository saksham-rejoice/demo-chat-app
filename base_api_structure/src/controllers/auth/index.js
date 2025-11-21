import jwt from "jsonwebtoken";
import { User } from "../../models";
import { success, badRequest, internalServerError } from "../../helpers";

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
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
      refreshToken,
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
        email: user.email,
      },
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

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (jwtError) {
      return badRequest(res, "Invalid or expired refresh token");
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return badRequest(res, "User not found");
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    success(res, "Token refreshed successfully", {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    internalServerError(res, "Token refresh failed");
  }
};

export const userDetailsByToken = async (request, response) => {
  try {
    const { id } = request.user;
    const user = await User.findById(id).select("_id username email");
    success(response, "User details fetched successfully", user);
  } catch (error) {
    internalServerError(response, error.message);
  }
};
