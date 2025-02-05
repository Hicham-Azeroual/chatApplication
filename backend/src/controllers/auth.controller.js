import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // Use Gmail or any other email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

// Forgot Password



export const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Generate a JWT token for password reset
      const resetToken = jwt.sign(
        { userId: user._id }, // Payload
        process.env.JWT_SECRET, // Secret key
        { expiresIn: "1h" } // Token expires in 1 hour
      );
  
      // Save the reset token to the user document
      user.resetPasswordToken = resetToken;
      await user.save();
  
      // Send the reset link via email
      const resetUrl = `http://localhost:5173/reset-password/${resetToken}`; // Frontend reset password page
  
      // Load the HTML template
      const templatePath = path.join(__dirname, "../emailTemplates/resetPassword.html");
      console.log("Template Path:", templatePath); // Debug: Log the template path
  
      let htmlTemplate = fs.readFileSync(templatePath, "utf8");
  
      // Debug: Log the HTML content before replacement
      console.log("Email HTML Content Before Replacement:", htmlTemplate);
  
      // Replace placeholders with actual values
      htmlTemplate = htmlTemplate.replace("{{resetUrl}}", resetUrl);
  
      // Debug: Log the HTML content after replacement
      console.log("Email HTML Content After Replacement:", htmlTemplate);
  
      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: "Password Reset",
        html: htmlTemplate, // HTML version
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste it into your browser to complete the process:\n\n
          ${resetUrl}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`, // Plain text version
      };
  
      console.log("Sending email to:", user.email);
      console.log("Reset URL:", resetUrl);
  
      // Send the email
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
  
      res.status(200).json({ message: "Password reset link sent to your email" });
    } catch (error) {
      console.error("Error in forgotPassword controller:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
// Reset Password
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
      // Verify the reset token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Find the user by the decoded userId
      const user = await User.findOne({
        _id: decoded.userId,
        resetPasswordToken: token, // Ensure the token matches
      });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Update the user's password and clear the reset token
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
  
      await user.save();
  
      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Error in resetPassword controller:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };