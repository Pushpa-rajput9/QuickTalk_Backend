import express from "express";
//import dotenv from "dotenv";
import cors from "cors";
import otpRoute from "./src/routes/otp.route.js";
import connectDB from "./src/db/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// Body parser middleware (for handling JSON data)
app.use(cookieParser());
app.use(
  cors({
    origin: "https://quicktalk-frontend-x6r6.onrender.com",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/otp", otpRoute);

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR :", error);
      throw error;
    });
    app.listen(PORT || 3000, () => {
      console.log(`Server is running at port :  ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed!!!!", err);
  });
