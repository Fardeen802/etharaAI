import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const sendToken = (res, token, user, statusCode = 200) => {
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: false, // 🔥 change to true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(statusCode)
    .json({
      message: "Success",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userCount = await User.countDocuments();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userCount === 0 ? "admin" : role || "member",
    });

    const token = createToken(user._id);

    sendToken(res, token, user, 201);
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createToken(user._id);

    sendToken(res, token, user);
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const logout = (req, res) => {
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
      })
      .status(200)
      .json({ message: "Logged out successfully" });
  };
export const me = async (req, res) => {
  res.json({
    user: req.user,
  });
};