const mongoose = require("mongoose");
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({
  username: {
    type: String, 
    required: [true, "Please enter a username."], 
    lowercase: true, 
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please enter a password.'],
    minlength: [8, 'Minimum password length should be 8 characters.'],
    trim: true
  },
  email: {
    type: String, 
    required: [true, 'Please enter an email.'], 
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email.']
  },
  liked: [mongoose.ObjectId],
  position: {latitude: Number, longitude: Number}
}, {collection: 'Users', timestamps: true});

// UserSchema.index({ username: 1, email: 1 }, { unique: true});


UserSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt(); 
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.plugin(uniqueValidator);

module.exports = UserSchema;
