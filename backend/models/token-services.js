const mongoose = require("mongoose");
const TokenSchema = require("./token");
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

async function findTokenWithUserId(id) {
  const tokenModel = getDbConnection().model("Token", TokenSchema);
  try {
    return await tokenModel.findById(id);
  } catch (error) {
    return undefined;
  }
}

async function checkValidToken(id, token) {
  const tokenModel = getDbConnection().model("Token", TokenSchema);
  try {
    return await tokenModel.findOne({
      userId: id,
      token: token,
    });
  } catch (error) {
    return undefined;
  }
}

async function addToken(token) {
  const tokenModel = getDbConnection().model("Token", TokenSchema);
  const tokenToAdd = new tokenModel(token);
  const savedToken = await tokenToAdd.save();
  return savedToken;
}

async function deleteToken(token) {
  const tokenModel = getDbConnection().model("Token", TokenSchema);
  await tokenModel.deleteOne({ userId: token.userId });
  return true;
}

exports.findTokenWithUserId = findTokenWithUserId;
exports.checkValidToken = checkValidToken;
exports.addToken = addToken;
exports.deleteToken = deleteToken;
