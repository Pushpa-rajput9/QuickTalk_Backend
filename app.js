// import express from "express";
// //import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";
// import userRoute from "./src/routes/UserRoute.js";
// import connectDB from "./src/db/db.js";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;
// // Body parser middleware (for handling JSON data)
// //app.use(cookieParser());
// const allowedOrigins = [
//   "https://quicktalk-frontend-x6r6.onrender.com",
//   "http://localhost:5173",
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true, // <-- This is important
//   })
// );

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use((req, res, next) => {
//   console.log("Incoming URL:", req.originalUrl);
//   next();
// });
// app.use("/api/v1/user", userRoute);

// connectDB()
//   .then(() => {
//     app.on("error", (error) => {
//       console.log("ERROR :", error);
//       throw error;
//     });
//     app.listen(PORT || 3000, () => {
//       console.log(`Server is running at port :  ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log("MongoDB connection failed!!!!", err);
//   });

// ********************************SOCKET.IO***************************************************************

import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import userRoute from "./src/routes/UserRoute.js";
import connectDB from "./src/db/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http"; // <-- For Socket.IO
import { Server } from "socket.io"; // <-- Import Socket.IO

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server so Socket.IO can work
const httpServer = createServer(app);

// Allowed origins for CORS
const allowedOrigins = [
  "https://quicktalk-frontend-x6r6.onrender.com",
  "http://localhost:5173",
];

// Middlewares
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
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/user", userRoute);

// Connect to DB
connectDB()
  .then(() => {
    // Initialize Socket.IO
    const io = new Server(httpServer, {
      cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
      },
    });

    // Socket.IO event listeners
    io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Example: Listen for messages
      socket.on("send_message", (data) => {
        console.log("Message received:", data);
        // Broadcast to everyone except sender
        socket.broadcast.emit("receive_message", data);
      });

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });

    // Start server
    httpServer.listen(PORT, () => {
      console.log(`Server is running at port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed!!!!", err);
  });
