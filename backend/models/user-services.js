const mongoose = require('mongoose');
const UserSchema = require("./user");

let dbConnection;

function getDbConnection() {
    if (!dbConnection) {
      dbConnection = mongoose.createConnection(process.env.CONNECTION_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      });
    }
    return dbConnection;
  }
  
async function addUser(user){
    const userModel = getDbConnection().model("User", UserSchema);
    try{
        const userToAdd = new userModel(post);
        const savedUser = await userToAdd.save()
        return savedUser;
    }catch(error) {
        console.log(error);
        return false;
    }   
}

async function getUsers(){
    const userModel = getDbConnection().model("User", UserSchema);
    const result = await userModel.find();
    return result;  
}

async function findUserById(id){
    const userModel = getDbConnection().model("User", UserSchema);    
    try{
        return await userModel.findById(id);
    }catch(error) {
        console.log(error);
        return undefined;
    }
}

async function getUserLiked(id){
    const userModel = getDbConnection().model("User", UserSchema);    
    try{
        return await userModel.findById(id).select("liked -_id");
    }catch(error) {
        console.log(error);
        return undefined;
    }
}

async function addUserLiked(user_id, post_id){
    const userModel = getDbConnection().model("User", UserSchema);    
    try{
        return await userModel.findByIdAndUpdate(user_id, {$push:{liked: post_id}})
    }catch(error) {
        console.log(error);
        return undefined;
    }
}

exports.getUsers = getUsers;
exports.addUser = addUser;
exports.findUserById = findUserById;
exports.getUserLiked = getUserLiked;
exports.addUserLiked = addUserLiked;