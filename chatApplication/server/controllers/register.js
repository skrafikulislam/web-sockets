import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  console.log("Body:", req.body); // Log body
  console.log("File:", req.file); // Log file

  const userData = JSON.parse(req.body.userData);
  const { username, password } = userData;

  const file = req.file ? req.file.filename : null;

  try {
    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      password: hashedPassword,
      image: req.file ? file : null,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error in register controller:", error);
    res.status(500).json({ message: "Failed to register user in database" });
  }
};

const login = async (req, res) => {
  console.log("Body:", req.body); // Log body

  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user._id }, "iraki", {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      message: "User logged in successfully",
      user: user,
      token: token,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Failed to login user in database" });
  }
};

const verify = async (req, res) => {
  // console.log("User:", req.user); // Log user

  res.json({
    success: true,
    message: "User is authenticated",
    user: req.user,
  });
};

export { register, login, verify };
