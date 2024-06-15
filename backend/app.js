const express = require("express");
const app = express();
const sessionMiddleware = require("./sessionmiddleware");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const errorHandler = require("./controllers/ErrorHandler");
const AppError = require("./util/AppError");
const Database = require("./lib/Database");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const cors = require("cors");
const corsOptions = {
  // Allow only requests from this domain
  origin: "http://localhost:5173",
  credentials: true, // Allow credentials
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(passport.initialize());
app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.session());

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      const db = new Database();
      try {
        await db.open();

        // Find the user by email
        const user = await db.findOne(User, { email: email });
        console.log(user);

        // If user not found
        if (!user) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        // Match password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        // User and password both match, return user
        return done(null, user);
      } catch (err) {
        console.error(err);
        return done(err);
      } finally {
        await db.close();
      }
    }
  )
);
passport.serializeUser((user, cb) => {
  console.log(`serializeUser ${user._id}`);
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  console.log(`deserializeUser ${user._id}`);
  cb(null, user);
});

// routes
app.use("/auth", require("./routes/auth"));

// handleing unhandled routes
app.use("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// handling errors
app.use(errorHandler);

module.exports = { app };
