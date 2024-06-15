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
  findOne = (model, query = {}) => {
    return model.findOne(query);
  };
  find = (model, query = {}) => {
    return model.find(query);
  };
}
module.exports = Database;
