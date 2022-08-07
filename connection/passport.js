const Users = require("../models/usersModel");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_NAME}users/google/callback`,
    },
    async function (accessToken, refreshToken, profile, cb) {
      const googleUser = await Users.findOne({ googleId: profile.id });
      if (googleUser) {
        return cb(null, googleUser);
      }
      const user = await Users.findOne({ email: profile.emails[0].value });
      if (user) {
        return cb(null);
      }
      const password = await bcrypt.hash(process.env.DEFAULT_PASSWORD, 12);
      await Users.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value,
        password,
        googleId: profile.id,
      });
      return cb(null, newUser);
    }
  )
);
