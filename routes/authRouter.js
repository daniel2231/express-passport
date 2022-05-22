//Signup Login
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", function (req, res) {
  User.create(
    {
      username: req.body.username,
      password: req.body.password,
    },
    function (err, user) {
      if (err) {
        return res.status(500).json({
          message: "Internal Server Error",
          err,
        });
      } else {
        res.status(200);
      }
    }
  );
});

router.post("/login", function (req, res) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ message: err });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.json({ message: err });
      }

      // jwt 토큰 생성
      const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
      return res.json({ token });
    });
  })(req, res);
});

module.exports = router;
