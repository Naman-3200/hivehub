import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const googleAuthSuccess = async (req, res) => {
  try {
    if (!req.user) {
      console.log("No user in request");
      return res.redirect(`${process.env.CLIENT_URL}/auth/failure`);
    }

    const token = jwt.sign(
      {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role, // Added role field
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Token generated:", token ? "Yes" : "No");

    const redirectURL = `${process.env.CLIENT_URL}/auth/success?token=${token}`;
    console.log("Redirecting to:", redirectURL);

    res.redirect(redirectURL);
  } catch (error) {
    console.error("Google auth success error:", error);
    res.redirect(`${process.env.CLIENT_URL}/auth/failure`);
  }
};

export const googleAuthFailure = (req, res) => {
  console.log("Google auth failure callback hit");
  res.redirect(`${process.env.CLIENT_URL}/auth/failure`);
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  });
};

export const getAuthStatus = (req, res) => {
  console.log("🔍 Auth status check - User:", req.user ? "Exists" : "None");

  if (req.user) {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profilePicture: req.user.profilePicture,
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }
};
