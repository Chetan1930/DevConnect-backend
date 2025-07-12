const { configDotenv } = require("dotenv");
configDotenv();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors"); 
const app = express();


const authroute=require("./routes/authRoutes");
// Passport 
require("./config/passport");

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // secure: true if HTTPS
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authroute);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => console.log(`✅ Server running on port ${process.env.PORT}`));
  })
  .catch(err => console.error("❌ MongoDB error:", err));
