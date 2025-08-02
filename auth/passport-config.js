const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
const db = require("../models/queries");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.getUserByUsername(username);
      if(!user){
        return done(null, false, { message: "Username not found!" });
      }

      const match = await bcrypt.compare(password, user.password);
      if(!match){
        return done(null, false, { message: "Password is incorrect!" });
      }

      return done(null, user);
    }catch(err){
      return done(err);
    }
  })
);


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
},

async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await db.findOrCreateByGoogle(profile);
    return done(null, user);
  } catch (err) {
    return done(err);
  }

}));



function googleAuthRedirect(req, res, next) {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
}

function googleAuthCallback(req, res, next) {
  passport.authenticate('google', (err, user, info) => {
    if(err) return res.status(500).json({ message: err.message });
    if(!user) return res.status(401).json({ message: "Authentication failed" });

    // Manually log in the user to create session
    req.login(user, (err) => {
      if(err) return res.status(500).json({ message: err.message });
      return res.status(200).json({ message: "Login successful", user: user });
    });
  })(req, res, next);
}


passport.serializeUser((user, done) => {
    done(null, user.id);
});


passport.deserializeUser(async(id, done) => {
    try{
        const user = await db.getUserById(Number(id));
        done(null, user);
    }catch(err){
        done(err, null);
    }
})





function handleLogin(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if(err) return next(err);
    if(!user){
      return res.status(401).json({ message: info?.message || "Invalid username or password" });
    }

    req.login(user, (err) => {
      if(err) return next(err);
      return res.status(200).json({ message: "login successful", user: user });
    });
  })(req, res, next);
}


module.exports = {
  passport,
  handleLogin,
  googleAuthCallback,
  googleAuthRedirect
}