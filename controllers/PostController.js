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
