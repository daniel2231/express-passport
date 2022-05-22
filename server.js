require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { PORT, MONGO_URI } = process.env;
const app = express();
const cookieParser = require("cookie-parser");
//Passport 등록
const passport = require("passport");
require("./config/passport");

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.set("views", __dirname + "/views/pages");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//passport 등록
app.use(passport.initialize());

const authRouter = require("./routes/authRouter");

app.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      res.render("index");
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`App open in port: ${PORT}`);
});
