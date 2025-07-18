const { configDotenv } = require("dotenv");
configDotenv();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require('connect-flash');
const cors = require("cors"); 
const app = express();

//Routes imporint bhai shab...
const authroute=require("./routes/authRoutes");
const profileRoute = require('./routes/profileRoutes');
const blogRoute = require('./routes/blogRoutes');

// Passport 
require("./config/passport");

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(flash());
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // true only in production with HTTPS
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authroute);
app.use("/api/profile",profileRoute)
app.use('/api/blog', blogRoute);

app.use("/", require('./routes/Chekauth'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => console.log(`✅ Server running on port ${process.env.PORT}`));
  })
  .catch(err => console.error("❌ MongoDB error:", err));
