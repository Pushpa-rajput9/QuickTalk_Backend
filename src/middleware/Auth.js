import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authenticateUser = (req, res, next) => {
  // const token = req.cookies?.token;
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from `Bearer token`

  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded; // Attach decoded user data to request
    console.log("Authenticated User ID:", decoded.id);

    next(); // Proceed to next middleware
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Session expired. Please log in again." });
    }
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
