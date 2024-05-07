const express = require("express");
const {
  registerUser,
  authUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/register").post(registerUser)
router.post("/login", authUser);
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});
router.post("/forgot-password",forgotPassword)
router.post("/reset-password/:token", resetPassword)


module.exports = router;