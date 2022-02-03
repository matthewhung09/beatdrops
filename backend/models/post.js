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
  posted_On: {
    type: Date,
    default: Date.now,
    required: true,
  },
  likes: {type: Number},
}, {collection : 'posts_list'});

module.exports = PostSchema;