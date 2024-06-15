const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const db = mongoose.connection;

const sessionMiddleware = session({
  secret: process.env.SECRETKEY,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongoUrl: db.client.s.url }),
});
module.exports = sessionMiddleware;
