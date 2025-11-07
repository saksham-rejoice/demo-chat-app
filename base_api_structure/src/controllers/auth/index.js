import jwt from "jsonwebtoken";
import { User } from "../../models";
import { success, badRequest } from "../../helpers";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return badRequest(req, res, null, "User already exists");
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);

    success(req, res, {
      message: "User registered successfully"
    });
  } catch (error) {
    badRequest(req, res, error, "Registration failed");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return badRequest(req, res, null, "Invalid credentials");
    }

    const token = generateToken(user._id);

    success(req, res, {
      accessToken: token,
      message: "Login Successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    badRequest(req, res, error, "Login failed");
  }
};