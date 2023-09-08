const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Declearing a dummy data(will be replace with database)
const users = [{ id: 1, username: "user1", password: "1111" }];

passport.use(
  new LocalStrategy((username, password, done) => {
    const user = users.find((u) => u.username === username);
    if (!user) return done(null, false);
    bcrypt.compare(password, user.password, (err, res) => {
      if (err) return done(err);
      if (!res) return done(null, false);
      return done(null, user);
    });
    console.log(user);
  })
);

// /Passport session serialization/derserialization
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = users.find((u) => u.id == id);
  done(null, user);
});

module.exports = passport;
