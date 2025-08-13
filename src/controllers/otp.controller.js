import otpGenerator from "otp-generator";
import { User } from "../models/user.model.js"; // ✅ Adjust path as per your project
import { sendSmsOtp } from "../middleware/otp.Auth.js"; // ✅ Update path if needed

// Generate OTP (utility function)
export const generateOTP = () => {
  return otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
};

// Send OTP to email or phone
export const sendOTP = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const otp = generateOTP();

    await User.deleteMany({ identifier });
    await User.create({ identifier, otp });

    sendSmsOtp(identifier, otp);
    console.log("Sending OTP to:", identifier, "OTP:", otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};
export const verifyOTP = async (req, res) => {
  const { identifier, otp } = req.body;
  const record = await User.findOne({ identifier, otp });

  if (!record)
    return res.status(400).json({ message: "Invalid or expired OTP" });

  // Optional: delete OTP after successful verification
  //await User.deleteMany({ identifier });

  res.status(200).json({ message: "OTP verified successfully" });
};
