const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    default: null,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  provider: {
    type: String,
    default: null,
  },
  created_ts: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("user", userSchema);
