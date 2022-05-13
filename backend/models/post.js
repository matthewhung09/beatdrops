const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
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
    likes: { type: Number },
    reposts: { type: Number },
    lastPosted: {
      type: Date,
      default: new Date(),
      required: true,
      expires: 259200,
    },
    location: {
      name: String,
      lat: Number,
      long: Number,
      onCampus: Boolean,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    spotify_id: {
      type: String,
      trim: true,
    },
    spotify_uri: {
      type: String,
    },
  },
  { collection: "Posts", timestamps: true }
);

module.exports = PostSchema;
