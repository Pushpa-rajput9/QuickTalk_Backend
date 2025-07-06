import { UserNo } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const CreateUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "All fields are mandatory." });
    }

    const existingUser = await UserNo.findOne({ identifier });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }
    //const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserNo({ identifier, password });
    const token = user.generateToken();
    user.accessToken = token;

    await user.save();

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // ❌ only use `true` on HTTPS
      sameSite: "None", // "Strict" | "Lax" | "None" (for cross-origin)
      maxAge: 1000 * 60 * 60, // 1 hour
    });
    // res.status(200).json({ message: "Cookie sent", token });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        identifier: user.identifier,
        token,
      },
    });
  } catch (error) {
    console.error("CreateUser Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const LoginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: "All fields are mandatory." });
    }
    const user = await UserNo.findOne({ identifier });
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }
    const checkPassword = await user.isPasswordCorrect(password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Invalid Password." });
    }
    const token = user.generateToken();
    user.accessToken = token;
    await user.save();
    console.log(token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      domain: ".onrender.com", // <--- allows subdomain cookie sharing
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        identifier: user.identifier,
        token,
      },
    });
  } catch (error) {
    console.error("LoginUser Error:", error);
    res.status(500).json({ message: "Login failed Internal server error" });
  }
};
export const LogoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, // ✅ must match how it was set
    sameSite: "None",
  });
  res.status(200).json({ message: "Logout successful" });
};
export const checkAuth = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ authenticated: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ authenticated: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ authenticated: false });
  }
};
