import express from "express";
import { sendOTP } from "../controllers/otp.controller.js";
import { verifyOTP } from "../controllers/otp.controller.js";
import {
  checkAuth,
  CreateUser,
  getUserById,
  LoginUser,
  LogoutUser,
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middleware/Auth.js";

const router = express.Router();

router.post("/register", CreateUser);
router.post("/login", LoginUser);
router.get("/:id", authenticateUser, getUserById);
router.post("/logout", LogoutUser);
router.post("/verify-otp", verifyOTP);
router.get("/check-auth", checkAuth);

export default router;
