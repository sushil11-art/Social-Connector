const { validationResult } = require("express-validator");
const Post = require("../models/Post");
const User = require("../models/User");
exports.addPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await User.findById(req.user.id).select("-password");
    const newPost = new Post({
      text: req.body.text,
      user: req.user.id,
      name: user.name,
      avatar: user.avatar,
    });
    const post = await newPost.save();
    return res.json({ post });
  } catch (err) {
    return res.status(500).send("Server error");
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json({ posts });
  } catch (err) {
    return res.status(500).send("Server error");
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found with that id" });
    }
    res.json({ post });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found with that id" });
    }
    return res.status(500).send("Server error");
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found with that id" });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "USer not authorized" });
    }
    await post.remove();
    res.json({ msg: "Post removed sucessfully" });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found with that id" });
    }
    return res.status(500).send("Server error");
  }
};

exports.likePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);
    // check whether post has been already liked by user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already been liked" });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    return res.status(500).send("Server error");
  }
};
exports.unlikePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);
    // check whether post has been already liked by user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post has not been liked" });
    }
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    return res.status(500).send("Server error");
  }
};

exports.commentPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await User.findById(req.user.id).select("-password");
    const post = await Post.findById(req.params.id);
    const newComment = {
      text: req.body.text,
      user: req.user.id,
      name: user.name,
      avatar: user.avatar,
    };
    post.comments.unshift(newComment);
    await post.save();
    res.json(post.comments);
    return res.json({ post });
  } catch (err) {
    return res.status(500).send("Server error");
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    // find comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    // console.log(comment);
    // make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "comment does not exists" });
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    return res.status(500).send("Server error");
  }
};
