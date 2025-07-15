const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register Controller
exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    if (!username || !email || !password || !role) {
      return res.status(405).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      role,
      password: hashedPassword, // ← Fix: correctly store hashed password
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not registered" });

    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass) return res.status(401).json({ message: "Invalid credentials" });

    // Create tokens
    // const accessToken = jwt.sign(
    //   { userId: user._id, username: user.username, role: user.role },
    //   process.env.SECRET_JWT,
    //   { expiresIn: "1d" }
    // );

    // const refreshToken = jwt.sign(
    //   { userId: user._id, username: user.username },
    //   process.env.SECRET_JWT_REFRESH,
    //   { expiresIn: "7d" }
    // );

    // Optional: send refreshToken as cookie
    res.cookie("token", refreshToken, {
      httpOnly: true,
      secure: true, // true if HTTPS
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "User login successful",
      token: accessToken,
      user: {
        username: user.username,
        userId: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};
