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
const allowedOrigins = [
  "https://quicktalk-frontend-x6r6.onrender.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // <-- This is important
  })
);
// Handle preflight requests explicitly
app.options("*", cors());
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
