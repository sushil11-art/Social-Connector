const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
// const isEmpty = require('../validation/is-Empty');
const router = express.Router();

const { body, validationResult } = require("express-validator");
const User = require("../models/User");
// const { delete } = require('../routes/users');

const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // console.log(req.body);
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: " User with that email already exists" }] });
    }

    // get avatar from email
    const avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm",
    });
    // create new user
    user = new User({
      name,
      email,
      avatar,
      password,
    });
    // hash the password using gen salt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    let saveUser = await user.save();

    // send user data without password
    let safeUser = { ...saveUser._doc };
    delete safeUser.password;
    return res.status(201).json(safeUser);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};
exports.login = async (req, res, body) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // console.log(req.body);
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentias" }] });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentias" }] });
    }
    const payload = {
      user: {
        id: user.id,
      },
    };
    jwt.sign(
      payload,
      process.env.TOKEN_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        return res.json({ token });
      }
    );
    // const safeUser={...user};
    // delete safeUser.password;
    // const payload={...user};
    // delete payload.password
    // console.log(payload);
    // // const payload={
    // //     user:{
    // //         id:user.id
    // //     }
    // // };

    // jwt.sign(payload,process.env.TOKEN_SECRET,{expiresIn:360000},(err,token)=>{
    //     if (err) throw err;
    //      return res.json({success:true,token:"Bearer"+token});
    // })
    // const token=await jwt.sign({user_id:user._id},process.env.TOKEN_SECRET,{expiresIn:360000})
    // return res.json({success:true,token:"bearer"+token});
  } catch (err) {
    // console.error(err.message);
    return res.status(500).send("Server error");
  }
};
