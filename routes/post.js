const express = require("express");
const { body } = require("express-validator");
const { addPost } = require("../controllers/PostController");
const router = express.Router();
const auth = require("../middleware/auth");
// const { body } = require("express-validator");

router.post(
  "/",
  [auth, [body("text", "Text is required").not().isEmpty()]],
  addPost
);

module.exports = router;
