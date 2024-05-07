const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getTags } = require("../controllers/tagsController");

const router = express.Router();

router.route("/").get(getTags)

module.exports = router;