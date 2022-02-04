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
}, {collection : 'posts_list', timestamps: true});

module.exports = PostSchema;