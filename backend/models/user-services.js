const mongoose = require("mongoose");
const UserSchema = require("./user");
const bcrypt = require("bcrypt");

let dbConnection;

function setConnection(newConn) {
  dbConnection = newConn;
  return dbConnection;
}

function getDbConnection() {
  if (!dbConnection) {
    dbConnection = mongoose.createConnection(process.env.CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  return dbConnection;
}

async function addUser(user) {
  const userModel = getDbConnection().model("User", UserSchema);
  const checkUser = await userModel.findOne({ email: user.email });
  if (checkUser) {
    return undefined;
  } else {
    const userToAdd = new userModel(user);
    const savedUser = await userToAdd.save();
    return savedUser;
  }
}

async function findUserById(id) {
  const userModel = getDbConnection().model("User", UserSchema);
  try {
    return await userModel.findById(id);
  } catch (error) {
    return undefined;
  }
}

async function findUserByEmail(email) {
  const userModel = getDbConnection().model("User", UserSchema);
  return await userModel.findOne({ email: email });
}

async function updateRefresh(id, r) {
  const userModel = getDbConnection().model("User", UserSchema);
  try {
    return await userModel.findByIdAndUpdate(id, { $set: { refresh_token: r } }, { new: true });
  } catch (error) {
    return undefined;
  }
}

async function addUserLiked(user_id, post_id) {
  const userModel = getDbConnection().model("User", UserSchema);
  try {
    return await userModel.findByIdAndUpdate(user_id, { $push: { liked: post_id } }, { new: true });
  } catch (error) {
    return undefined;
  }
}

async function removeUserLiked(user_id, post_id) {
  const userModel = getDbConnection().model("User", UserSchema);
  try {
    return await userModel.findByIdAndUpdate(user_id, { $pull: { liked: post_id } }, { new: true });
  } catch (error) {
    return undefined;
  }
}
async function login(email, password) {
  const userModel = getDbConnection().model("User", UserSchema);
  const user = await userModel.findOne({ email: email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
}

exports.addUser = addUser;
exports.findUserById = findUserById;
exports.addUserLiked = addUserLiked;
exports.removeUserLiked = removeUserLiked;
exports.login = login;
exports.setConnection = setConnection;
exports.updateRefresh = updateRefresh;
exports.findUserByEmail = findUserByEmail;
