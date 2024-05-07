const express = require("express");
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");
// Middlewares
const { protect, isAdmin } = require("../middlewares/authMiddleware");
const { createComment } = require("../controllers/commentsController");

const router = express.Router();

router.route("/").get(getPosts).post(protect, isAdmin, createPost);
router
  .route("/:id")
  .get(getPostById)
  .put(protect, isAdmin, updatePost)
  .delete(protect, isAdmin, deletePost);

router.route("/:id/comments").post(protect, createComment)

module.exports = router;
