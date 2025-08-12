import express, { Router } from "express";
import { sendOTP, verifyOTP } from "../controllers/otp.controller.js";
import {
  CreateUser,
  getUserById,
  LoginUser,
  LogoutUser,
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middleware/Auth.js";

const router = express.Router();

router.post("/register", CreateUser);
//router.route("/register").post(CreateUser);
router.post("/login", LoginUser);
router.get("/:id", authenticateUser, getUserById);
router.post("/logout", LogoutUser);
router.post("/verify-otp", verifyOTP);

router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(r.route.path);
  }
});

export default router;
