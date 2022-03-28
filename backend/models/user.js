const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
var uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new mongoose.Schema(
    {
        username: {
            required: true,
            type: String,
            trim: true,
        },
        password: {
            required: true,
            type: String,
            trim: true,
        },
        email: {
            required: true,
            type: String,
            unique: true,
            lowercase: true,
        },
        liked: [mongoose.ObjectId],
    },
    { collection: "Users", timestamps: true }
);

// UserSchema.index({ username: 1, email: 1 }, { unique: true});

UserSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.plugin(uniqueValidator);

module.exports = UserSchema;
