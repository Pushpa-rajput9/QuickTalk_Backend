import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

export const sendSmsOtp = async (phone, otp) => {
  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE,
      to: phone,
    });
  } catch (error) {
    throw new Error("Failed to send OTP " + error.message);
  }
};
console.log("SID:", process.env.TWILIO_SID);
console.log("AUTH:", process.env.TWILIO_AUTH);

export const verifyOTP = async (req, res) => {
  const { identifier, otp } = req.body;
  const record = await UserNo.findOne({ identifier, otp });

  if (!record)
    return res.status(400).json({ message: "Invalid or expired OTP" });

  // Optional: delete OTP after successful verification
  await UserNo.deleteMany({ identifier });

  res.status(200).json({ message: "OTP verified successfully" });
};
