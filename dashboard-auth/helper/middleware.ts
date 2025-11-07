import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export function verifyToken(
  request: NextRequest
): { id: string; email: string } | null {
  try {
    const authHeader = request.headers.get("authorization");


    if (!authHeader || !authHeader.startsWith("Bearer ")) {

      return null;
    }

    const token = authHeader.substring(7);


    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
    };

    return decoded;
  } catch (error) {

    return null;
  }
}
