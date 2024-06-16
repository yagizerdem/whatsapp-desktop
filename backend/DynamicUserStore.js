const userStore = {};

class UserData {
  constructor() {
    this.id = null;
    this.targetuserid = null;
    this.socketid = null;
  }
}
module.exports = { userStore, UserData };
