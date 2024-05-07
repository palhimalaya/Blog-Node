const User = require("../models/user");
const { generateToken } = require("../config/generateToken");
const { sendPasswordResetEmail } = require("../utils/email");

const registerUser = async (req, res) => {
  let body = req.body;

  const { fullName, email, password } = body;

  if (!fullName || !email || !password) {
    res.status(400);
    throw new Error("Please enter all required fields");
  }

  const userExits = await User.findOne({ email });
  if (userExits) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    full_name: fullName,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Failed to create user" });
  }
};
const authUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(201).json({
      _id: user._id,
      fullName: user.first_name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = generateToken(user._id);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000

    await user.save();
    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const resetToken = req.params.token;
  try {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



module.exports = {
  registerUser,
  authUser,
  allUsers,
  forgotPassword,
  resetPassword,
};
