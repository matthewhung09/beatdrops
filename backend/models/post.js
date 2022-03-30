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
        location: {
            name: String,
            lat: Number,
            long: Number 
        },
        url: {
            type: String,
            required: true,
            trim: true,
        },
        spotify_id: {
            type: String,
            trim: true
        },
    },
    { collection: "Posts", timestamps: true }
);

module.exports = PostSchema;
