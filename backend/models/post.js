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
  position: {
    longitude: Number,
    latitude: Number,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
}, {collection : 'Posts', timestamps: true});

module.exports = PostSchema;