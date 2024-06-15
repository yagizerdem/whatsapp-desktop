const Database = require("../lib/Database");
const User = require("../models/User");
const AppError = require("../util/AppError");
const passport = require("passport");
async function register(req, res) {
  const body = req.body;
  console.log(body);
  const db = new Database();
  await db.open();
  const newUser = new User(body);
  await newUser.save();
  await db.close();
  return res
    .status(200)
    .json({ ok: true, message: "user register successfull" });
}

const login = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err); // Passes errors to Express.
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ message: "Login successful", user });
    });
  })(req, res, next);
};

async function isLoggedIn(req, res, next) {
  if (req.user) {
    return res.status(200).json({ ok: true, message: "user is logged in" });
  }
  return res
    .status(200)
    .json({ ok: false, message: "user is not logged in !" });
}
async function logOut(req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ ok: true, message: "log out successfull" });
  });
}

module.exports = { register, login, isLoggedIn, logOut };
