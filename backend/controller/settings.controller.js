import User from "../model/user.model.js";

// ✅ Get user profile + subscription info
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; // assuming JWT or middleware sets req.user

    const user = await User.findById(userId).select(
      "name email role profilePicture isVerified subscription"
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ success: false, message: "Failed to load profile" });
  }
};

// ✅ Update profile info (name, profile picture)
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, profilePicture } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, profilePicture },
      { new: true, runValidators: true }
    ).select("name email role profilePicture subscription");

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ success: false, message: "Profile update failed" });
  }
};
