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

async function findUserById(id) {
  const tokenModel = getDbConnection().model("Token", TokenSchema);
  try {
    return await tokenModel.findById(id);
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

exports.findUserById = findUserById;
exports.addToken = addToken;
