const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      //decode token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      return res.status(401).json({ message: "Not Authorized, token failed" });
    }
  }
  if (!token) {
    return res.status(401).json({ message: "Not Authorized, no token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(401).json({
      message: "Not Authorized as an admin",
    
    })
  }
};

module.exports = { protect, isAdmin };