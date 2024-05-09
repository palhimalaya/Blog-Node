const Comment = require("../models/comment");
const Post = require("../models/post");

const createComment = async (req, res) => {
  const { content } = req.body;
  if(!content){
    return res.status(400).json({
      message: "Content is required",
    });
  }
  try {
    const comment = new Comment({
      content: content,
      author: req.user._id,
      post: req.params.id,
    });
    await comment.save();

    const post = await Post.findById(req.params.id);
    post.comments.push(comment._id);
    await post.save();

    const commentWithAuthor = await Comment.findById(comment._id).populate('author', 'full_name');

    res.status(201).json({
      message: "Comment created successfully",
      comment: commentWithAuthor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const updateComment = async (req, res) => {
  const { content } = req.body;
  if(!content){
    return res.status(400).json({
      message: "Content is required",
    });
  }
  try {
    const comment = await Comment.findById(req.params.id);
    if(!comment){
      return res.status(404).json({
        message: "Comment not found",
      });
    }
    if(comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin'){
      return res.status(403).json({
        message: "You are not authorized to update this comment",
      });
    }
    comment.content = content;
    await comment.save();
    res.json({
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
}

const deleteComment = async (req, res) =>{
  try {
    const comment = await Comment.findById(req.params.id);
    if(!comment){
      return res.status(404).json({
        message: "Comment not found",
      });
    }
    if(comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin'){
      return res.status(403).json({
        message: "You are not authorized to delete this comment",
      });
    }

    await comment.deleteOne();
    res.json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
}

module.exports = { 
  createComment,
  updateComment,
  deleteComment,
 };