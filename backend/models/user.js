const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  recipes: {
    type: [String],
    required: false
  },
  refreshToken: {
    type: String,
    required: false
  }
});
const User = mongoose.model('User', UserSchema);

module.exports = User;