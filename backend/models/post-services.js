const mongoose = require('mongoose');
const PostSchema = require("./post");

let dbConnection;

function setConnection(newConn){
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

  async function getPostsByLocation(lat, long){
    const postModel = getDbConnection().model("Post", PostSchema);
    const result = await postModel.find({'location.lat': {$lte: (lat + 0.0145), $gte: (lat - 0.0145)}, 
                                        'location.long': {$lte: (long + 0.0183), $gte: (long - 0.0183)}});
    return result;
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
        return false;
    }   
}

async function updateLikeStatus(id, liked_status){
    const postModel = getDbConnection().model("Post", PostSchema);
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
}

async function findPostById(id){
    const postModel = getDbConnection().model("Post", PostSchema);    
    try{
        return await postModel.findById(id);
    }catch(error) {
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
exports.getPostsByLocation = getPostsByLocation;
exports.addPost = addPost;
exports.updateLikeStatus = updateLikeStatus;
// exports.unlikePost = unlikePost;
exports.findPostById = findPostById;
exports.setConnection = setConnection;
