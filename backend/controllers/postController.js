const Post = require("../models/post");
const Tag = require("../models/tag");
const Comment = require("../models/comment");

const getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  try {
    const posts = await Post.find()
      .populate("author", "full_name")
      .populate("category", "name")
      .populate('tags', 'name')
      .populate({
          path: 'comments',
          populate: { path: 'author', select: 'first_name' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "full_name")
      .populate("category", "name")
      .populate("tags", "name")
      .populate({
        path: "comments",
        populate: { path: "author", select: "full_name" },
      });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const createPost = async (req, res) => {
  const { title, content, category, tags } = req.body;

  try {
    const newTagIds = [];

    for (const tagName of tags) {
      let tag = await Tag.findOne({ name: tagName });

      if (!tag) {
        tag = new Tag({ name: tagName });
        await tag.save();
        newTagIds.push(tag._id);
      } else {
        newTagIds.push(tag._id);
      }
    }

    const post = new Post({
      title: title,
      content: content,
      author: req.user.id,
      category: category,
      tags: newTagIds,
    });

    const newPost = await post.save();
    res.json(newPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};


const updatePost = async (req, res) => {
  const { title, content, category, tags } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    const newTagIds = [];

    for (const tagName of tags) {
      let tag = await Tag.findOne({ name: tagName });

      if (!tag) {
        tag = new Tag({ name: tagName });
        await tag.save();
        newTagIds.push(tag._id);
      } else {
        newTagIds.push(tag._id);
      }
    }
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.title = title;
    post.content = content;
    post.category = category;
    post.tags = newTagIds;
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    await post.deleteOne();
    res.json({ message: "Post removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };
