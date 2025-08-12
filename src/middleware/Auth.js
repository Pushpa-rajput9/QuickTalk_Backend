import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization header missing or malformed" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    console.log("Authenticated User ID:", decoded.id);
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Session expired. Please log in again." });
    }

    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
