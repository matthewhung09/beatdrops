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

  async function getPosts(title, artist){
    const userModel = getDbConnection().model("Post", PostSchema);
    let result;
    if(title === undefined && artist === undefined){
        result = await userModel.find();
    }
    else if(title && !artist){
        result = findPostByTitle(title);
    }
    else if(!title && artist){
        result = findPostByArtist(artist)
    }
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

async function findPostByTitle(title){
    const postModel = getDbConnection().model("Post", PostSchema);
    return await postModel.find({'title':title});
}

async function findPostByArtist(artist){
    const postModel = getDbConnection().model("Post", PostSchema);
    return await postModel.find({'artist':artist});
}

exports.getPosts = getPosts;
exports.addPost = addPost;