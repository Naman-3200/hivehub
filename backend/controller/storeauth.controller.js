import StoreUser from "../model/storeuser.model.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, "process.env.JWT_SECRET", { expiresIn: "7d" });
};

// Register store user
export const registerStoreUser = async (req, res) => {
  try {
    const { name, email, password, storeId } = req.body;
    if (!name || !email || !password || !storeId)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await StoreUser.findOne({ email, storeId });
    if (existingUser)
      return res.status(400).json({ message: "User already exists for this store" });

    const user = await StoreUser.create({ name, email, password, storeId });
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login store user
export const loginStoreUser = async (req, res) => {
  try {
    const { email, password, storeId } = req.body;
    if (!email || !password || !storeId)
      return res.status(400).json({ message: "All fields are required" });

    const user = await StoreUser.findOne({ email, storeId });
    if (!user)
      return res.status(400).json({ message: "User not found for this store" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
