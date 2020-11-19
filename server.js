const express = require("express");

const mongoose = require("mongoose");

const path = require("path");

const cors = require("cors");

const bodyParser = require("body-parser");

const passport = require("passport");

const dotenv = require("dotenv");
dotenv.config();
// pass
const app = express();
//import routes here
const users = require("./routes/users");
const profile = require("./routes/profile");
app.use(cors());

// passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport.js")(passport);
// middlewares

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/users", users);
app.use("/api/profile", profile);
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((result) => {
    console.log("Connected to db");
    console.log("App will be run on port 4000");
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
