const express = require("express");
const { protect, isAdmin } = require("../middlewares/authMiddleware");
const { getCategories, createCategory } = require("../controllers/categoryController");

const router = express.Router();

router.route("/").get(protect, isAdmin, getCategories).post(protect, isAdmin, createCategory)

module.exports = router;
