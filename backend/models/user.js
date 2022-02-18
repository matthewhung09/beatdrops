const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
      type: String,
      required: true,
      trim: true,
  },
  password: {
      type: String,
      required: true,
      trim: true,
  },
  liked: [mongoose.ObjectId],
  position: {latitude: Number, longitude: Number},

}, {collection : 'Users', timestamps: true});

const User = mongoose.model("User", UserSchema);
module.exports = User;