const Invitation = require("../models/Invitation");
const Database = require("../lib/Database");
const mongoose = require("mongoose");
const User = require("../models/User");

async function find(req, res) {
  const db = new Database();
  await db.open();
  const { userid } = req.query;
  const userId = new mongoose.Types.ObjectId(userid); // Convert to ObjectId
  console.log(userId);
  let results = await Invitation.aggregate([
    {
      $match: {
        $and: [{ status: "pending" }, { to: userId }],
      },
    },
    {
      $lookup: {
        from: "users", // The name of the collection to join with (User collection)
        localField: "from", // Field from the Invitation collection
        foreignField: "_id", // Field from the User collection
        as: "fromUser", // Alias for the joined data
      },
    },
    {
      $unwind: "$fromUser", // Unwind the fromUser array
    },
    {
      $lookup: {
        from: "users", // The name of the collection to join with (User collection)
        localField: "to", // Field from the Invitation collection
        foreignField: "_id", // Field from the User collection
        as: "toUser", // Alias for the joined data
      },
    },
    {
      $unwind: "$toUser", // Unwind the toUser array
    },
  ]);

  await db.close();

  return res.status(200).json({ ok: true, data: results });
}
async function reject(req, res) {
  const db = new Database();
  await db.open();
  const { invitationid } = req.body;
  await db.findOneAndUpdate(
    Invitation,
    { _id: invitationid },
    { status: "canceled" }
  );

  await db.close();

  return res
    .status(200)
    .json({ ok: true, message: "invitation rejected ... " });
}
async function accept(req, res) {
  const db = new Database();
  await db.open();
  const { invitationid } = req.body;

  const invitation = await db.findOne(Invitation, { _id: invitationid });
  const userFromid = invitation.from;
  const userToid = invitation.to;
  const userFrom = await db.findOne(User, { _id: userFromid });
  const userTo = await db.findOne(User, { _id: userToid });
  userTo.friends.push(userFrom._id); // Add user2 as a friend of user1
  userFrom.friends.push(userTo._id); // Add user1 as a friend of user2
  await db.findOneAndUpdate(User, { _id: userFromid }, userFrom);
  await db.findOneAndUpdate(User, { _id: userToid }, userTo);
  await db.findOneAndUpdate(
    Invitation,
    { _id: invitationid },
    { status: "approved" }
  );

  await db.close();
  return res
    .status(200)
    .json({ ok: true, message: "invitation acceppted ... " });
}

module.exports = { find, reject, accept };
