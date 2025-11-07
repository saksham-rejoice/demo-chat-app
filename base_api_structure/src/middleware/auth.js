import jwt from "jsonwebtoken";
import { User } from "../models";
import { badRequest } from "../helpers";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return badRequest(req, res, null, "Access denied. No token provided.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return badRequest(req, res, null, "Invalid token.");
    }

    req.user = user;
    next();
  } catch (error) {
    badRequest(req, res, error, "Invalid token.");
  }
};