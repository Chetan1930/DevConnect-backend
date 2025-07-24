// app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const cors = require("cors");
const http = require("http");
const parser = require('./middlewares/multer');
const { Server } = require("socket.io");
const Message = require('./models/msg');

// Create app and server
const app = express();
const server = http.createServer(app);

// --- Socket.IO Configuration ---
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// --- Middleware ---
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());

// --- Session Configuration ---
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Use true in production with HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// --- Passport Config ---
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

// --- Routes ---
app.use("/", require("./routes/Chekauth"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/blog", require("./routes/blogRoutes"));
app.use("/api/blogs", require("./routes/likeAnsComment"));

// --- Socket.IO Events ---
io.on("connection", (socket) => {
  console.log("⚡ User connected");

  // Send all previous messages to new client
  Message.find().sort({ timestamp: -1 }).limit(100).sort({ timestamp: 1 })
.then((messages) => {
    socket.emit("message_history", messages);

  });

   socket.on("send_message", async (data) => {
    try {
      const newMessage = new Message({
        text: data.text,
        username: data.username,
        timestamp: data.timestamp,
      });

      await newMessage.save();
      io.emit("receive_message", newMessage); // broadcast to all
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected");
  });
});

// --- Connect DB and Start Server ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT || 5000, () =>
      console.log(`✅ Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

