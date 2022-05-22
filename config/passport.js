//Passport-local 세팅
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

//Passport-jwt 세팅
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;

//로컬 전략 세팅
passport.use(
  new LocalStrategy(function (username, password, done) {
    return User.findOne({ username, password })
      .then((user) => {
        if (!user || password !== user.password) {
          return done(null, false, {
            message: "아이디 또는 비밀번호가 일치하지 않습니다.",
          });
        }
        return done(null, user);
      })
      .catch((err) => done(err));
  })
);

let cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["token"];
  }
  return token;
};

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET,
    },
    async function (jwtPayload, done) {
      try {
        console.log(jwtPayload);
        const user = await User.findOne({ where: { id: jwtPayload.id } });

        if (user) {
          return done(null, user);
        }

        done(null, false, { message: "올바르지 않은 인증 정보입니다" });
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);
