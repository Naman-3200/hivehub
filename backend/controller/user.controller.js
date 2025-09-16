import bcrypt from "bcrypt";
import { User } from "../model/user.model.js";
import { validationResult } from "express-validator";

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name, email, password } = req.body;

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const userCreated = new User({
      name,
      email,
      password: hashPassword,
    });

    await userCreated.save();

    res.status(201).json({
      message: "User created successfully!",
      user: {
        name: userCreated.name,
        email: userCreated.email,
      },
    });
  } catch (error) {
    console.error("Registration failed:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User does not exist" });

    const userPassword = await bcrypt.compare(password, user.password);

    if (!userPassword)
      return res.status(400).json({ message: "Password is incorrect!" });

    res.status(200).json({
      message: "Login Successful!",
      user: {
        email: user.email,
      },
      token: "demo-server-token",
    });
  } catch (error) {
    console.error("There is an issue while Logging in:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

export { register, login };
