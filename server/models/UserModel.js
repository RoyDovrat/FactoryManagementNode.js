const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    FullName: String,
    NumOfActions: Number,
    RemainingAllowdActions: Number
  },
  { versionKey: false }
);

const User = mongoose.model('user', userSchema);

module.exports = User;