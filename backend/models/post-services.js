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
    const userModel = getDbConnection().model("Post", PostSchema);
    let result = await userModel.find();
    return result;  
}

async function addPost(post){
    const postModel = getDbConnection().model("Post", PostSchema);
    try{
        const postToAdd = new postModel(post);
        const savedPost = await postToAdd.save()
        return savedPost;
    }catch(error) {
        console.log(error);
        return false;
    }   
}

exports.getPosts = getPosts;
exports.addPost = addPost;