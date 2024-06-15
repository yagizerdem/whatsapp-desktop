const mongoose = require("mongoose");
const { SessionAwareAdapter } = require("socket.io-adapter");
class Database {
  constructor() {}
  open = async () => {
    await mongoose.connect(process.env.CONNECTIONSTRING);
  };
  close = async () => {
    await mongoose.disconnect();
  };
  findOne = async (model, query = {}) => {
    return model.findOne(query);
  };
}
module.exports = Database;
