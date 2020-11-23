const express = require("express");
const { body } = require("express-validator");
const {
  addPost,
  getPosts,
  getPost,
  deletePost,
  likePost,
  unlikePost,
  commentPost,
  deleteComment,
} = require("../controllers/PostController");
const router = express.Router();
const auth = require("../middleware/auth");
// const { body } = require("express-validator");

// @ post route to api/posts
// add new post
router.post(
  "/",
  [auth, [body("text", "Text is required").not().isEmpty()]],
  addPost
);

// @get route to api/posts
// get all posts
// private
router.get("/", auth, getPosts);

// @get route to api/posts/:id
// get all posts by id
// private
router.get("/:id", auth, getPost);

// @delete route to api/posts/:id
// delete posts by id
// private
router.delete("/:id", auth, deletePost);

// @put route to api/posts/like:id
// like  post by id
// private
router.put("/like/:id", auth, likePost);

// @put route to api/posts/unlike:id
// unlike  post by id
// private
router.put("/unlike/:id", auth, unlikePost);

// @post route to api/posts/comment/:id
// unlike  post by id
// private
router.post(
  "/comment/:id",
  [auth, [body("text", "Text is required").not().isEmpty()]],
  commentPost
);

// delete comment route api/posts/:id/:comment_id
router.delete("/comment/:id/:comment_id", auth, deleteComment);
module.exports = router;
