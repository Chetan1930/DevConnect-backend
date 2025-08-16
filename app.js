// app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const flash = require("connect-flash");
const cors = require("cors");
const http = require("http");
const parser = require("./middlewares/multer");
const { Server } = require("socket.io");
const User = require("./models/user");
const Message = require("./models/msg");
const PrivateMessage = require("./models/PrivateMessage");

// Create app and server
const app = express();
const server = http.createServer(app);

// --- Middleware ---
const allowedOrigins = [
  "http://localhost:5173",
  "https://devconnect71.netlify.app",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());

// --- Session Configuration ---
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24,
  },
});

app.use(sessionMiddleware);

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

// --- Socket.IO Configuration ---
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Share session middleware with Socket.IO
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

// Authenticate using Passport session
io.use((socket, next) => {
  if (socket.request.session.passport?.user) {
    socket.userId = socket.request.session.passport.user;
    next();
  } else {
    console.log("Unauthenticated socket connection");
    next(new Error("Authentication error"));
  }
});

const onlineUsers = new Map(); // socketId -> userId

io.on("connection", async (socket) => {
  console.log("⚡ User connected:", socket.userId);
  onlineUsers.set(socket.id, socket.userId);

  // Send list of online user IDs
  io.emit("online_users", Array.from(new Set(onlineUsers.values())));

  // PUBLIC chat history
  socket.on("request_message_history", async () => {
    const history = await Message.find()
      .sort({ timestamp: 1 })
      .lean();
    const withUsername = await Promise.all(
      history.map(async (m) => {
        const user = await User.findById(m.userId).lean();
        return { ...m, username: user?.username || "Unknown" };
      })
    );
    socket.emit("message_history", withUsername);
  });

  // PUBLIC send message
  socket.on("send_message", async (msg) => {
    const newMsg = new Message({
      userId: socket.userId,
      text: msg.text,
      timestamp: new Date()
    });
    await newMsg.save();

    const user = await User.findById(socket.userId).lean();
    io.emit("receive_message", {
      username: user.username,
      text: msg.text,
      timestamp: newMsg.timestamp
    });
  });

  // PRIVATE history request
  socket.on("request_private_message_history", async ({ toUserId }) => {
    const history = await PrivateMessage.find({
      $or: [
        { from: socket.userId, to: toUserId },
        { from: toUserId, to: socket.userId }
      ]
    })
      .sort({ timestamp: 1 })
      .lean();

    const withUsername = await Promise.all(
      history.map(async (m) => {
        const user = await User.findById(m.from).lean();
        return {
          username: user?.username || "Unknown",
          text: m.text,
          timestamp: m.timestamp
        };
      })
    );

    socket.emit("private_message_history", withUsername);
  });

  // PRIVATE send
  socket.on("private_message", async ({ toUserId, message }) => {
    const newMsg = new PrivateMessage({
      from: socket.userId,
      to: toUserId,
      text: message.text,
      timestamp: new Date()
    });
    await newMsg.save();

    // Send to recipient if online
    for (const [sockId, uid] of onlineUsers) {
      if (uid.toString() === toUserId.toString()) {
        io.to(sockId).emit("private_message", {
          from: socket.userId,
          message: {
            username: (await User.findById(socket.userId).lean()).username,
            text: message.text,
            timestamp: newMsg.timestamp
          }
        });
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.userId);
    onlineUsers.delete(socket.id);
    io.emit("online_users", Array.from(new Set(onlineUsers.values())));
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