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
    trim: true,
  },
  uri: {
    type: String,
    required: true,
    trim: true,
  }
}, {collection : 'Posts', timestamps: true});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;