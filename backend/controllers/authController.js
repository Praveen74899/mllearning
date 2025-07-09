const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendMail = require("../config/mailer");


// Register Controller
exports.registerController = async (req, res) => {
  console.log("Request body:", req.body);

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Login Controller
exports.loginController = async (req, res) => {

  try {
    const { email, password } = req.body;
    console.log(req.body)
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (!existing) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, existing.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Password incorrect' });
    }

    const token = jwt.sign(
      { id: existing._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(200).json({
      token,
      user: {
        id: existing._id,
        name: existing.name,
        email: existing.email
      }
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
};



exports.forgotController = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ 1. Token generate karo
    const token = jwt.sign(
      { id: user._id }, // payload
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // ✅ 2. Token DB me bhi store karo (optional but better for safety)
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    // ✅ 3. Token link banao
    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const subject = "Reset Your Password";
    const html = `
      <p>Click below to reset your password:</p>
      <a href="${resetLink}" style="color:white; background-color:blue; padding:10px 20px; border-radius:5px;">
        Click here
      </a>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await sendMail(email, subject, html);
    res.status(200).json({ message: "Reset link sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};


exports.resetPasswordController = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.exp * 1000 < Date.now()) {
      return res.status(400).json({ message: "Token expired" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "Invalid token or user not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();
    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Token expired or invalid" });
  }
};
