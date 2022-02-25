const mongoose = require('mongoose');
const PostSchema = require("./post");

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

  async function getPosts(title, artist){
    const postModel = getDbConnection().model("Post", PostSchema);
    let result;
    if(title === undefined && artist === undefined){
        result = await postModel.find();
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

async function updateLikeStatus(id, liked_status){
    const postModel = getDbConnection().model("Post", PostSchema);
    try{
        if (!liked_status) {
            return await postModel.findByIdAndUpdate(id, { 
                $inc: {likes: 1}, 
                $set: {liked: true}, 
            },
                {new: true}
            );
        }
        else {
            return await postModel.findByIdAndUpdate(id, { 
                $inc: {likes: -1}, 
                $set: {liked: false}, 
            },
                {new: true}
            );
        }
        
    }catch(error) {
        console.log(error);
        return false;
    }
}

// async function unlikePost(id){
//     const postModel = getDbConnection().model("Post", PostSchema);
//     try{
//         return await postModel.findByIdAndUpdate(id, { 
//             $inc: { likes: -1 }, 
//             $set: {liked: false}, 
//         },
//             {new: true}
//         );
//     }catch(error) {
//         console.log(error);
//         return false;
//     }
// }

async function findPostById(id){
    const postModel = getDbConnection().model("Post", PostSchema);    
    try{
        return await postModel.findById(id);
    }catch(error) {
        console.log(error);
        return undefined;
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
exports.updateLikeStatus = updateLikeStatus;
// exports.unlikePost = unlikePost;
exports.findPostById = findPostById;
