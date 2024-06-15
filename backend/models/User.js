const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  firstName: {
    type: String,
    validate: {
      validator: function (value) {
        return value.length > 2 && value.length < 20;
      },
      message: "First name must be between 3 and 19 characters",
    },
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    validate: {
      validator: function (value) {
        return value.length > 2 && value.length < 20;
      },
      message: "Last name must be between 3 and 19 characters",
    },
    required: [true, "Last name is required"],
  },
  email: {
    type: String,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value);
      },
      message: "Please fill a valid email address",
    },
    unique: true,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    validate: {
      validator: function (value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value
        );
      },
      message:
        "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character",
    },
    required: [true, "Password is required"],
  },
});

Schema.pre("save", async function () {
  const password = this.password;
  const hash = await bcrypt.hash(password, 10);
  this.password = hash;
});

const User = mongoose.model("User", Schema);
module.exports = User;
