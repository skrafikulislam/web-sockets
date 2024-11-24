import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

const authVerify = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing - Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    // Check if token is present
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided - Unauthorized" });
    }

    // Verify the JWT
    let decoded;
    try {
      decoded = jwt.verify(token, "iraki");
    } catch (err) {
      console.error("JWT verification error:", err);
      return res.status(401).json({ message: "Invalid token - Unauthorized" });
    }

    // Check if decoding was successful
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Failed to decode token - Unauthorized" });
    }

    // Fetch user from the database
    const user = await UserModel.findOne({ _id: decoded.id }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found - Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    res.status(401).json({ message: "Invalid token - Unauthorized" });
  }
};

export default authVerify;
