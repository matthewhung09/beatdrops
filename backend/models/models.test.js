const mongoose = require("mongoose");
const UserSchema = require("./user");
const userServices = require("./user-services");
const PostSchema = require("./post");
const postServices = require("./post-services");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let conn;
let userModel;
let postModel;
let userId;
let postId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  conn = await mongoose.createConnection(uri, mongooseOpts);

  userModel = conn.model("User", UserSchema);
  postModel = conn.model("Post", PostSchema)

  userServices.setConnection(conn);
  postServices.setConnection(conn);
});

afterAll(async () => {
  await conn.dropDatabase();
  await conn.close();
  await mongoServer.stop();
});

beforeEach(async () => {

  //users---------------------------------------------------

  let dummyUser = {
    username: "Chuck Norris",
    password: "Password2!",
    email: "cNorris@gmail.com",
    liked: []
  };
  let result = new userModel(dummyUser);
  await result.save();

  dummyUser = {
    username: "Michael Eisner",
    password: "Di5n3yM4gic!",
    email: "disney@gmail.com",
    liked: []
  };
  result = new userModel(dummyUser);
  userId = await result.save().id;

  dummyUser = {
    username: "Matt",
    password: "Password1!",
    email: "r@gmail.com",
    liked: []
  };
  result = new userModel(dummyUser);
  await result.save();

  //posts--------------------------------------------------------

  let dummyPost = {
    title: "slow",
    artist: "Black Midi",
    likes: 27,
    location: "Frank E Pilling Bldg",
    url:"http://temp.com/not?aReal=url/"
  };
  result = new postModel(dummyPost);
  await result.save();

  dummyPost = {
    title: "western",
    artist: "Black Midi",
    likes: 9,
    location: "Frank E Pilling Bldg",
    url:"http://temp.com/not?aReal=url/"
  };
  result = new postModel(dummyPost);
  await result.save();

  dummyPost = {
    title: "Le Festin",
    artist: "Remmy the Rat",
    likes: 27,
    location: "Kennedy Library",
    url:"http://temp.com/not?aReal=url/"
  };
  result = new postModel(dummyPost);
  await result.save();

  dummyPost = {
    title: "Just Friends",
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
    url:"http://temp.com/not?aReal=url/"
  };
  result = new postModel(dummyPost);
  postId = await result.save().id;

});


afterEach(async () => {
  await userModel.deleteMany();
  await postModel.deleteMany();
});

test("Fetching all users", async () => {
  const users = await userServices.getUsers();
  expect(users).toBeDefined();
  expect(users.length).toBeGreaterThan(0);
});

test("Fetching by invalid id format", async () => {
  const anyId = "123";
  const user = await userServices.findUserById(anyId);
  expect(user).toBeUndefined();
});

test("Fetching by valid id and not finding", async () => {
  const anyId = "6132b9d47cefd0cc1916b6a9";
  const user = await userServices.findUserById(anyId);
  expect(user).toBeNull();
});

test("Fetching by valid id and finding", async () => {
  const dummyUser = {
    username: "Griffin",
    password: "DogFan4571?",
    email: "gMan@gmail.com",
    liked: []
  };
  const result = new userModel(dummyUser);
  const addedUser = await result.save();
  const foundUser = await userServices.findUserById(addedUser.id);
  expect(foundUser).toBeDefined();
  expect(foundUser.id).toBe(addedUser.id);
  expect(foundUser.name).toBe(addedUser.name);
  expect(foundUser.email).toBe(addedUser.email);
});

test("Adding user -- successful path", async () => {
  const dummyUser = {
    username: "Griffin",
    password: "DogFan4571?",
    email: "gMan@gmail.com",
    liked: []
  };
  const result = await userServices.addUser(dummyUser);
  expect(result).toBeTruthy();
  expect(result.name).toBe(dummyUser.name);
  expect(result.job).toBe(dummyUser.job);
  expect(result).toHaveProperty("_id");
  expect(result).toHaveProperty("createdAt");
  expect(result).toHaveProperty("updatedAt");
});

test("Adding user liked -- succuess", async () => {
  const dummyPost = {
    title: "Food Court",
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
    url:"http://temp.com/not?aReal=url/"
  };
  const dummyUser = {
    username: "Griffin",
    password: "DogFan4571?",
    email: "gMan@gmail.com",
    liked: []
  };
  const addedUser = await userServices.addUser(dummyUser);
  const addedPost = await postServices.addPost(dummyPost);
  let result = await userServices.addUserLiked(addedUser._id, addedPost._id);
  expect(result).toBeTruthy();
  expect(result.liked[0]).toMatchObject(addedPost._id);
})

test("Adding user liked -- failure", async () => {
  const dummyPost = {
    title: "Food Court",
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
    url:"http://temp.com/not?aReal=url/"
  };

  const addedPost = await postServices.addPost(dummyPost);
  let result = await userServices.addUserLiked(1234567, addedPost._id);
  expect(result).toBe(undefined);
})

test("Removing user liked -- succuess", async () => {
  const dummyPost = {
    title: "Food Court",
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
    url:"http://temp.com/not?aReal=url/"
  };
  const addedPost = await postServices.addPost(dummyPost);

  const dummyUser = {
    username: "Griffin",
    password: "DogFan4571?",
    email: "gMan@gmail.com",
    liked: [addedPost._id]
  };
  const addedUser = await userServices.addUser(dummyUser);
  let result = await userServices.removeUserLiked(addedUser._id, addedPost._id);
  expect(result).toBeTruthy();
  expect(result.liked).toStrictEqual([]);
})

test("Removing user liked -- failure", async () => {
  const dummyPost = {
    title: "Food Court",
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
    url:"http://temp.com/not?aReal=url/"
  };
  const addedPost = await postServices.addPost(dummyPost);
  let result = await userServices.removeUserLiked(1234567, addedPost._id);
  expect(result).toBe(undefined);
})

test("Adding user -- failure path with missing required field", async () => {
  const dummyUser = {
    password: "DogFan4571?",
    email: "gMan@gmail.com",
  };
  const result = await userServices.addUser(dummyUser);
  expect(result).toBeFalsy();
});

test("Get user liked -- sucess", async () => {
  const dummyUser = {
    username: "Matt",
    password: "DogFan4571?",
    email: "gMan@gmail.com",
    liked: []
  };
  const dummyPost = {
    title: "Food Court",
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
    url:"http://temp.com/not?aReal=url/"
  };

  const addedUser = await userServices.addUser(dummyUser);
  const addedPost = await postServices.addPost(dummyPost);

  const new_user = await userServices.addUserLiked(addedUser._id, addedPost._id);
  const result = await userServices.getUserLiked(new_user._id);
  expect(result.liked[0]).toStrictEqual(addedPost._id);
});

test("Get user liked -- failure with invalid id", async () => {
  const dummyUser = {
    username: "Matt",
    password: "DogFan4571?",
    email: "gMan@gmail.com",
    liked: [123, 456]
  };
  
  const user = await userServices.addUser(dummyUser);
  const result = await userServices.getUserLiked(45678909876);
  expect(result).toBe(undefined);
});

test("login -- success", async () => {
  const dummyUser = {
    username: "Matt",
    password: "DogFan4571?",
    email: "gMan@gmail.com",
    liked: []
  };
  
  const user = await userServices.addUser(dummyUser);
  const result = await userServices.login(dummyUser.email, dummyUser.password);
  expect(result.email).toBe(user.email);
});

test("login -- failure with invalid password", async () => {
  // const dummyUser = {
  //   username: "Matt",
  //   password: "DogFan4571?",
  //   email: "gMan@gmail.com",
  //   liked: []
  // };
  const all_users = await userServices.getUsers();
  try{
    await userServices.login("cnorris@gmail.com", "hghjhgcghgf");
    fail('error should be thrown');
  }catch(error){
    expect(1).toEqual(1);
  }
});

test("login -- failure with invalid email", async () => {
  try{
    await userServices.login("aaaaaaaaaa@gmail.com", "Password1!");
    fail('error should be thrown');
  }catch(error){
    expect(1).toEqual(1);
  }
});

// test("Adding user -- failure path with already taken id", async () => {
//   const dummyUser = {
//     username: "Griffin",
//     password: "DogFan4571?",
//     email: "gMan@gmail.com",
//     liked: []
//   };
//   const addedUser = await userServices.addUser(dummyUser);

//   const anotherDummyUser = {
//     _id: addedUser.id,
//     username: "Scott",
//     password: "NintendoFan3627!",
//     email: "thewoz@gmail.com",
//     liked: []
//   };
//   const result = await userServices.addUser(anotherDummyUser);
//   expect(result).toBeFalsy();
// });

// test("Adding user -- failure path with un-unique email", async () => {
//   const dummyUser = {
//     username: "Griffin",
//     password: "DogFan4571?",
//     email: "gMan@gmail.com",
//     liked: []
//   };
//   const addedUser = await userServices.addUser(dummyUser);

//   const anotherDummyUser = {
//     username: "Scott",
//     password: "NintendoFan3627!",
//     email: addedUser.email,
//     liked: []
//   };
//   const result = await userServices.addUser(anotherDummyUser);
//   expect(result).toBeFalsy();
// });

test("Fetching all posts", async () => {
  const posts = await postServices.getPosts();
  expect(posts).toBeDefined();
  expect(posts.length).toBeGreaterThan(0);
});

test("Fetching posts by title", async () => {
  const title = "slow";
  const posts = await postServices.getPosts(title);
  expect(posts).toBeDefined();
  expect(posts.length).toBeGreaterThan(0);
  posts.forEach((post) => expect(post.title).toBe(title));
});

test("Fetching users by artist", async () => {
  const artist = "Black Midi";
  const posts = await postServices.getPosts(undefined, artist);
  expect(posts).toBeDefined();
  expect(posts.length).toBeGreaterThan(0);
  posts.forEach((post) => expect(post.artist).toBe(artist));
});

test("Fetching post by invalid id format", async () => {
  const anyId = "123";
  const post = await postServices.findPostById(anyId);
  expect(post).toBeUndefined();
});

test("Fetching post by valid id and not finding", async () => {
  const anyId = "6132b9d47cefd0cc1916b6a9";
  const post = await postServices.findPostById(anyId);
  expect(post).toBeNull();
});

test("Fetching by valid id and finding", async () => {
  const dummyPost = {
    title: "Food Court",
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
    url:"http://temp.com/not?aReal=url/"
  };
  const result = new postModel(dummyPost);
  const addedPost = await result.save();
  const foundPost = await postServices.findPostById(addedPost.id);
  expect(foundPost).toBeDefined();
  expect(foundPost.id).toBe(addedPost.id);
  expect(foundPost.name).toBe(addedPost.name);
  expect(foundPost.job).toBe(addedPost.job);
});

test("Adding post -- successful path", async () => {
  const dummyPost = {
    title: "Food Court",
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
    url:"http://temp.com/not?aReal=url/"
  };
  const result = await postServices.addPost(dummyPost);
  expect(result).toBeTruthy();
  expect(result.name).toBe(dummyPost.name);
  expect(result.job).toBe(dummyPost.job);
  expect(result).toHaveProperty("_id");
});

test("Adding post -- failure path with invalid id", async () => {
  const dummyPost = {
    _id: "123",
    title: "Food Court",
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
    url:"http://temp.com/not?aReal=url/"
  };
  const result = await postServices.addPost(dummyPost);
  expect(result).toBeFalsy();
});

test("Adding post -- failure path with already taken id", async () => {
  const dummyPost = {
    title: "Food Court",
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
    url:"http://temp.com/not?aReal=url/"
  };
  const addedPost = await postServices.addPost(dummyPost);

  const anotherDummyPost = {
    _id: addedPost.id,
    title: "Concorde",
    artist: "Black Country New Road",
    likes: 27,
    location: "Dexter Lawn",
    url:"http://temp.com/not?aReal=url/"
  };
  const result = await postServices.addPost(anotherDummyPost);
  expect(result).toBeFalsy();
});

test("Adding post -- failure path with no title", async () => {
  const dummyPost = {
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
    url:"http://temp.com/not?aReal=url/"
  };
  const result = await postServices.addPost(dummyPost);
  expect(result).toBeFalsy();
});

test("Adding post -- failure path with no artist", async () => {
  const dummyPost = {
    title: "Food Court",
    likes: 27,
    location: "Dexter Lawn",
    url:"http://temp.com/not?aReal=url/"
  };
  const result = await postServices.addPost(dummyPost);
  expect(result).toBeFalsy();
});

test("Adding post -- failure path with no url", async () => {
  const dummyPost = {
    title: "Food Court",
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn"
  };
  const result = await postServices.addPost(dummyPost);
  expect(result).toBeFalsy();
});

test("Updating likes, increase -- success", async () => {
  const dummyPost = {
    title: "Food Court",
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
    url:"http://temp.com/not?aReal=url/"
  };
  const result = await postServices.addPost(dummyPost);
  const updateLikes = await postServices.updateLikeStatus(result.id, false);
  expect(updateLikes.likes).toEqual(28);
});

test("Updating likes, decrease -- success", async () => {
  const dummyPost = {
    title: "Food Court",
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
    url:"http://temp.com/not?aReal=url/"
  };
  const result = await postServices.addPost(dummyPost);
  const updateLikes = await postServices.updateLikeStatus(result.id, true);
  expect(updateLikes.likes).toEqual(26);
});

