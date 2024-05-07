const express =  require("express")
const { protect } = require("../middlewares/authMiddleware");
const { updateComment, deleteComment } = require("../controllers/commentsController");

const router = express.Router();

router.route("/:id").put(protect, updateComment).delete(protect, deleteComment)

module.exports = router;