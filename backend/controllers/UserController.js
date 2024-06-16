const Database = require("../lib/Database");
const User = require("../models/User");
const APIfeatures = require("../util/APIfeatures");
const AppError = require("../util/AppError");
const { v4: uuidv4 } = require("uuid");

async function find(req, res) {
  // remove undefined values from object
  let filter = JSON.parse(
    JSON.stringify({
      username: req.query.username,
      email: req.query.email,
    })
  );
  //paginaiton limt 0 and skip 0 does  automatically not limit and skip data
  const skip = req.query?.skip || 0;
  const limit = req.query?.limit || 0;
  const contains = req.query?.contains || "";

  const db = new Database();
  await db.open();

  let query = db.find(User, filter);
  query = new APIfeatures({ query })
    .limit(limit)
    .skip(skip)
    .regexField("username", contains)
    .getQuery();
  const users = await query;
  await db.close();

  return res.status(200).json({ ok: true, data: users });
}
async function getCurrentUser(req, res, next) {
  if (!req.user) {
    next(new AppError("user is not logged in", 401));
  }
  return res.status(200).json({ ok: true, data: req.user });
}
async function uploadProfileImage(req, res) {
  const userFromDb = req.user;
  if (!userFromDb) throw new AppError("user is not autehnticated", 401);
  userFromDb.profileImage = req.body.filename;
  const db = new Database();
  await db.open();
  const newDocument = await db.findOneAndUpdate(
    User,
    { _id: userFromDb._id },
    userFromDb
  );
  await db.close();
  console.log("req body file name", req.body.filename);
  return res.status(200).json({ ok: true, data: newDocument });
}
module.exports = { find, getCurrentUser, uploadProfileImage };
