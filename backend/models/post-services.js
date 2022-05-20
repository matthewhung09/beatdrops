const mongoose = require("mongoose");
const PostSchema = require("./post");

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

async function getPostsByLocation(lat, long) {
  const postModel = getDbConnection().model("Post", PostSchema);
  const result = await postModel.find({
    "location.lat": { $lte: lat + 0.0724, $gte: lat - 0.0724 },
    "location.long": { $lte: long + 0.0915, $gte: long - 0.0915 },
  });
  return result;
}

async function addPost(post) {
  const postModel = getDbConnection().model("Post", PostSchema);
  try {
    const postToAdd = new postModel(post);
    const savedPost = await postToAdd.save();
    return savedPost;
  } catch (error) {
    return false;
  }
}

async function updateLikeStatus(id, liked_status) {
  const postModel = getDbConnection().model("Post", PostSchema);
  if (!liked_status) {
    return await postModel.findByIdAndUpdate(
      id,
      {
        $inc: { likes: 1 },
        $set: { liked: true },
      },
      { new: true }
    );
  } else {
    return await postModel.findByIdAndUpdate(
      id,
      {
        $inc: { likes: -1 },
        $set: { liked: false },
      },
      { new: true }
    );
  }
}

async function findDuplicates(post) {
  const postModel = getDbConnection().model("Post", PostSchema);
  return await postModel.find({
    title: post.title,
    artist: post.artist,
    "location.lat": { $lte: post.location.lat + 0.0145, $gte: post.location.lat - 0.0145 },
    "location.long": { $lte: post.location.long + 0.0183, $gte: post.location.long - 0.0183 },
  });
}

async function updateDuplicate(post) {
  const postModel = getDbConnection().model("Post", PostSchema);
  return await postModel.findOneAndUpdate(
    {
      title: post.title,
      artist: post.artist,
      "location.lat": { $lte: post.location.lat + 0.0145, $gte: post.location.lat - 0.0145 },
      "location.long": { $lte: post.location.long + 0.0183, $gte: post.location.long - 0.0183 },
    },
    { $inc: { reposts: 1 }, lastPosted: new Date(), location: post.location }
  );
}

exports.updateDuplicate = updateDuplicate;
exports.getPostsByLocation = getPostsByLocation;
exports.addPost = addPost;
exports.updateLikeStatus = updateLikeStatus;
// exports.unlikePost = unlikePost;
exports.setConnection = setConnection;
exports.findDuplicates = findDuplicates;
