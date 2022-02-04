const mongoose = require('mongoose');
const PostSchema = require("./post");

let dbConnection;

function getDbConnection() {
    if (!dbConnection) {
        dbConnection = mongoose.createConnection("mongodb://localhost:27017/posts", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
    return dbConnection;
  }

  async function getPosts(){
    const userModel = getDbConnection().model("Post", UserSchema);
    let result = await userModel.find();
    return result;  
}

async function addPost(post){
    // userModel is a Model, a subclass of mongoose.Model
    const userModel = getDbConnection().model("Post", UserSchema);
    try{
        // You can use a Model to create new documents using 'new' and 
        // passing the JSON content of the Document:
        const userToAdd = new userModel(post);
        const savedUser = await userToAdd.save()
        return savedUser;
    }catch(error) {
        console.log(error);
        return false;
    }   
}

exports.getPosts = getPosts;
exports.addPost = addPost;