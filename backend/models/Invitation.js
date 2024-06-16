const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  time: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "canceled"],
    default: "pending",
    required: true,
  },
});

const Invitation = mongoose.model("Invitation", Schema);

module.exports = Invitation;
