const passport = require("passport");
const {Strategy: LocalStrategy} = require("passport-local");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const KaKaoStrategy = require("passport-kakao").Strategy;
const {Strategy: NaverStrategy, Profile: NaverProfile} = require('passport-naver-v2');
const dotenv = require("dotenv");

dotenv.config();

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({email: email});
          if (!user) {
            return done(null, false, {reason: "User not found", error: "auth_005", status: 401});
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          }
          return done(null, false, {reason: "Wrong email or password format", error: "auth_004", status: 401});
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.ORIGIN_BACK}/user/google/callback`,
        passReqToCallback: true,
      },
      function (request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
      }
    )
  );
  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: `${process.env.ORIGIN_BACK}/user/naver/callback`,
        passReqToCallback: true,
      },
      function (request,accessToken, refreshToken, profile, done) {
          return done(null, profile);
      },
    ),
  );
  passport.use(
    new KaKaoStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_ID,
        callbackURL: `${process.env.ORIGIN_BACK}/user/kakao/callback`,
        passReqToCallback: true,
      },
      function (request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
      }
    )
  );
};
