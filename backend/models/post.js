const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  artist: {
    type: String,
    required: true,
    trim: true,
  },
  likes: {type: Number},
  liked: {type: Boolean},
  url: {
    type: String,
    required: true,
    trim: true,
  },
  album: {
    type: String,
    required: true,
    trime: true,
  }
}, {collection : 'posts_list', timestamps: true});

module.exports = PostSchema;