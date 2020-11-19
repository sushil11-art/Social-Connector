const express = require("express");
const { register, login } = require("../controllers/UserController");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// for passport will fix later
// router.get('/user',passport.authenticate("jwt",{session:false}),(req,res)=>{
//     res.json({msg:"User works"});
// })

router.get("/user", auth, (req, res) => {
  res.json({ msg: "User works" });
});
router.post(
  "/register",
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Please enter a valid email").isEmail(),
    body(
      "password",
      "Please enter a password of atleast 7 character or more"
    ).isLength({ min: 7 }),
  ],
  register
);

router.post(
  "/login",
  [
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  login
);

module.exports = router;
