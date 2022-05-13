const mongoose = require("mongoose");
const UserSchema = require("./user");
const userServices = require("./user-services");
const PostSchema = require("./post");
const postServices = require("./post-services");
const mockingoose = require("mockingoose");
const bcrypt = require("bcrypt");
const TokenSchema = require("./token");
const tokenServices = require("./token-services");

jest.mock("bcrypt");

let userModel;
let postModel;

beforeAll(async () => {
  userModel = mongoose.model("User", UserSchema);
  postModel = mongoose.model("Post", PostSchema);
  tokenModel = mongoose.model("Token", TokenSchema);
});

afterAll(async () => {});

beforeEach(async () => {
  jest.clearAllMocks();
  mockingoose.resetAll();
});

afterEach(async () => {});

test("Fetching by invalid id format", async () => {
  const anyId = "123";
  userModel.findById = jest.fn().mockRejectedValue(new Error("error"));
  const user = await userServices.findUserById(anyId);
  expect(user).toBeUndefined();
  expect(userModel.findById).toHaveBeenCalledWith(anyId);
});

test("Fetching by valid id and not finding", async () => {
  const anyId = "6132b9d47cefd0cc1916b6a9";
  userModel.findById = jest.fn().mockResolvedValue(null);
  const user = await userServices.findUserById(anyId);
  expect(user).toBeNull();
  expect(userModel.findById).toHaveBeenCalledWith(anyId);
});

test("Fetching by valid id and finding", async () => {
  const dummyUser = {
    _id: "randomid",
    username: "Griffin",
    password: "DogFan4571?",
    email: "gMan@gmail.com",
    liked: [],
  };

  userModel.findById = jest.fn().mockResolvedValue(dummyUser);
  const foundUser = await userServices.findUserById("randomid");
  expect(foundUser).toBeDefined();
  expect(foundUser.id).toBe(dummyUser.id);
  expect(foundUser.name).toBe(dummyUser.name);
  expect(foundUser.email).toBe(dummyUser.email);
});

test("Fetching by email and finding", async () => {
  const dummyUser = {
    _id: "randomid",
    username: "Griffin",
    password: "DogFan4571?",
    email: "gMan@gmail.com",
    liked: [],
  };

  userModel.findOne = jest.fn().mockResolvedValue(dummyUser);
  const foundUser = await userServices.findUserByEmail("gMan@gmail.com");
  expect(foundUser).toBeDefined();
  expect(foundUser.id).toBe(dummyUser.id);
  expect(foundUser.name).toBe(dummyUser.name);
  expect(foundUser.email).toBe(dummyUser.email);
});

test("Adding user -- successful path", async () => {
  const addedUser = {
    _id: "randomid",
    username: "Griffin",
    password: "DogFan4571?",
    email: "gMan@gmail.com",
    liked: [],
  };
  const toBeAdded = {
    username: "Griffin",
    password: "DogFan4571?",
    email: "gMan@gmail.com",
    liked: [],
  };
  userModel.findOne = jest.fn().mockResolvedValue(undefined);
  mockingoose(userModel).toReturn(addedUser, "save");
  const result = await userServices.addUser(toBeAdded);
  expect(result).toBeTruthy();
  expect(result).toHaveProperty("_id");
  expect(result).toHaveProperty("createdAt");
  expect(result).toHaveProperty("updatedAt");
});

test("Adding user -- successful path", async () => {
  const addedUser = {
    _id: "randomid",
    username: "Griffin",
    password: "DogFan4571?",
    email: "gMan@gmail.com",
    liked: [],
  };
  const toBeAdded = {
    username: "Griffin",
    password: "DogFan4571?",
    email: "gMan@gmail.com",
    liked: [],
  };
  userModel.findOne = jest.fn().mockResolvedValue(addedUser);
  const result = await userServices.addUser(toBeAdded);
  expect(result).toBeUndefined();
});

test("Adding user liked -- success", async () => {
  const dummyPost = {
    _id: "123",
    title: "Food Court",
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
    url: "http://temp.com/not?aReal=url/",
  };
  const userWithLiked = {
    username: "Griffin",
    password: "DogFan4571?",
    email: "gMan@gmail.com",
    liked: ["123"],
  };
  userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(userWithLiked);
  const result = await userServices.addUserLiked("ranodm user id", "123");
  expect(result).toBeTruthy();
  expect(result.liked[0]).toBe(dummyPost._id);
});

test("Adding user liked -- failure", async () => {
  const dummyPost = {
    title: "Food Court",
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
    url: "http://temp.com/not?aReal=url/",
  };

  userModel.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error("error"));
  const result = await userServices.addUserLiked("random user id", "123");
  expect(result).toBe(undefined);
});

test("Removing user liked -- succuess", async () => {
  const dummyPost = {
    _id: "123",
    title: "Food Court",
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
    url: "http://temp.com/not?aReal=url/",
  };
  const dummyPost2 = {
    _id: "456",
    title: "Ride or Die",
    artist: "Hippo Campus",
    likes: 27,
    location: "Dexter Lawn",
    url: "http://temp.com/not?aReal=url/",
  };
  const userWithoutLiked = {
    username: "Griffin",
    password: "DogFan4571?",
    email: "gMan@gmail.com",
    liked: ["456"],
  };
  userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(userWithoutLiked);
  const result = await userServices.removeUserLiked("ranodm user id", "123");
  expect(result).toBeTruthy();
  expect(result.liked[0]).toBe(dummyPost2._id);
});

test("Removing user liked -- failure", async () => {
  const dummyPost = {
    title: "Food Court",
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
    url: "http://temp.com/not?aReal=url/",
  };
  userModel.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error("error"));
  let result = await userServices.removeUserLiked(1234567, dummyPost._id);
  expect(result).toBe(undefined);
});

test("login -- success", async () => {
  const dummyUser = {
    username: "Matt",
    password: "DogFan4571?",
    email: "gMan@gmail.com",
    liked: [],
  };
  bcrypt.compare.mockResolvedValue(true);
  userModel.findOne = jest.fn().mockResolvedValue(dummyUser);
  const result = await userServices.login(dummyUser.email, dummyUser.password);
  expect(result.email).toBe(dummyUser.email);
});

test("login -- failure with invalid password", async () => {
  const dummyUser = {
    username: "Matt",
    password: "DogFan4571?",
    email: "gMan@gmail.com",
    liked: [],
  };
  bcrypt.compare.mockResolvedValue(false);
  userModel.findOne = jest.fn().mockResolvedValue(dummyUser);
  try {
    await userServices.login(dummyUser.email, "wrong password");
  } catch (e) {
    expect(e.message).toBe("incorrect password");
  }
});

test("login -- failure with invalid email", async () => {
  const dummyUser = {
    username: "Matt",
    password: "DogFan4571?",
    email: "gMan@gmail.com",
    liked: [],
  };
  userModel.findOne = jest.fn().mockResolvedValue(undefined);
  try {
    await userServices.login("wrongemail", dummyUser.password);
  } catch (e) {
    expect(e.message).toBe("incorrect email");
  }
});

test("reset password -- success", async () => {
  const dummyUser = {
    id: 123,
    username: "Matt",
    password: "newPassword1!",
    email: "gMan@gmail.com",
    liked: [],
  };
  userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(dummyUser);
  const updatedUser = await userServices.resetPassword(123, "newPassword1!");
  expect(updatedUser.password).toEqual(dummyUser.password);
});

test("reset password -- fail", async () => {
  const dummyUser = {
    id: 123,
    username: "Matt",
    password: "DogFan4571?",
    email: "gMan@gmail.com",
    liked: [],
  };
  userModel.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error("error"));
  const updatedUser = await userServices.resetPassword(123, "newPassword1!");
  expect(updatedUser).toBeUndefined;
});

test("Refresh token -- sucess", async () => {
  const dummyUser = {
    _id: "123",
    username: "Griffin",
    password: "DogFan4571?",
    email: "gMan@gmail.com",
    refresh_token: "abcdefghijk",
    liked: [],
  };

  userModel.findByIdAndUpdate = jest.fn().mockResolvedValue(dummyUser);
  const result = await userServices.updateRefresh("123", "abcdefghijk");
  expect(result).toBeTruthy();
  expect(result.refresh_token).toBe(dummyUser.refresh_token);
});

test("Refresh token -- failure", async () => {
  const dummyUser = {
    _id: "123",
    username: "Griffin",
    password: "DogFan4571?",
    email: "gMan@gmail.com",
    refresh_token: "abcdefghijk",
    liked: [],
  };

  userModel.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error("error"));
  const result = await userServices.updateRefresh("123", dummyUser.refresh_token);
  expect(result).toBe(undefined);
});

/* post-services tests */

test("Adding post -- successful path", async () => {
  const dummyPost = {
    _id: "123",
    title: "Food Court",
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
    url: "http://temp.com/not?aReal=url/",
  };
  const toBeAdded = {
    title: "Food Court",
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
    url: "http://temp.com/not?aReal=url/",
  };

  mockingoose(postModel).toReturn(dummyPost, "save");
  const result = await postServices.addPost(toBeAdded);
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
    url: "http://temp.com/not?aReal=url/",
  };
  mockingoose(postModel).toReturn(false, "save");
  const result = await postServices.addPost(dummyPost);
  expect(result).toBeFalsy();
});

test("Adding post -- failure path with no title", async () => {
  const dummyPost = {
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
    url: "http://temp.com/not?aReal=url/",
  };
  mockingoose(postModel).toReturn(false, "save");
  const result = await postServices.addPost(dummyPost);
  expect(result).toBeFalsy();
});

test("Adding post -- failure path with no artist", async () => {
  const dummyPost = {
    title: "Food Court",
    likes: 27,
    location: "Dexter Lawn",
    url: "http://temp.com/not?aReal=url/",
  };
  mockingoose(postModel).toReturn(false, "save");
  const result = await postServices.addPost(dummyPost);
  expect(result).toBeFalsy();
});

test("Adding post -- failure path with no url", async () => {
  const dummyPost = {
    title: "Food Court",
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
  };
  mockingoose(postModel).toReturn(false, "save");
  const result = await postServices.addPost(dummyPost);
  expect(result).toBeFalsy();
});

test("Updating likes, increase -- success", async () => {
  const updatedPost = {
    _id: "123",
    title: "Food Court",
    artist: "Potsu",
    likes: 28,
    location: "Dexter Lawn",
    url: "http://temp.com/not?aReal=url/",
  };
  const dummyPost = {
    _id: "123",
    title: "Food Court",
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
    url: "http://temp.com/not?aReal=url/",
  };
  postModel.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedPost);
  const updateLikes = await postServices.updateLikeStatus(dummyPost.id, false);
  expect(updateLikes.likes).toEqual(updatedPost.likes);
});

test("Updating likes, decrease -- success", async () => {
  const updatedPost = {
    _id: "123",
    title: "Food Court",
    artist: "Potsu",
    likes: 26,
    location: "Dexter Lawn",
    url: "http://temp.com/not?aReal=url/",
  };
  const dummyPost = {
    _id: "123",
    title: "Food Court",
    artist: "Potsu",
    likes: 27,
    location: "Dexter Lawn",
    url: "http://temp.com/not?aReal=url/",
  };
  postModel.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedPost);
  const updateLikes = await postServices.updateLikeStatus(dummyPost.id, true);
  expect(updateLikes.likes).toEqual(updatedPost.likes);
});

test("Get posts by location -- success", async () => {
  const postList = [
    {
      title: "slow",
      artist: "Black Midi",
      likes: 27,
      location: "Frank E Pilling Bldg",
      url: "http://temp.com/not?aReal=url/",
    },
    {
      title: "western",
      artist: "Black Midi",
      likes: 9,
      location: "Frank E Pilling Bldg",
      url: "http://temp.com/not?aReal=url/",
    },
    {
      title: "Le Festin",
      artist: "Remmy the Rat",
      likes: 27,
      location: "Kennedy Library",
      url: "http://temp.com/not?aReal=url/",
    },
    {
      title: "Just Friends",
      artist: "Potsu",
      likes: 27,
      location: "Dexter Lawn",
      url: "http://temp.com/not?aReal=url/",
    },
  ];
  postModel.find = jest.fn().mockResolvedValue(postList);
  const res = await postServices.getPostsByLocation(123, 456);
  expect(res).toBeDefined();
  expect(res.length).toBe(4);
});

test("Find duplicates -- success", async () => {
  const post = {
    _id: "123",
    title: "Food Court",
    artist: "Potsu",
    likes: 26,
    location: "Dexter Lawn",
    url: "http://temp.com/not?aReal=url/",
  };
  const dupe = {
    _id: "456",
    title: "Food Court",
    artist: "Potsu",
    likes: 0,
    location: "Dexter Lawn",
    url: "http://temp.com/not?aReal=url/",
  };
  postModel.find = jest.fn().mockResolvedValue(post);
  const res = await postServices.findDuplicates(dupe);
  expect(res).toBeDefined();
  expect(res.title).toBe(post.title);
  expect(res.artist).toBe(post.artist);
});

test("Update duplicate -- success", async () => {
  const post = {
    _id: "123",
    title: "Food Court",
    artist: "Potsu",
    likes: 26,
    reposts: 1,
    location: "Dexter Lawn",
    url: "http://temp.com/not?aReal=url/",
  };
  const dupe = {
    _id: "456",
    title: "Food Court",
    artist: "Potsu",
    likes: 0,
    reposts: 0,
    location: "Dexter Lawn",
    url: "http://temp.com/not?aReal=url/",
  };
  postModel.findOneAndUpdate = jest.fn().mockResolvedValue(post);
  const res = await postServices.updateDuplicate(dupe);
  expect(res).toBeDefined();
  expect(res.title).toBe(post.title);
  expect(res.artist).toBe(post.artist);
  expect(res.reposts).toBe(post.reposts);
});

/* token tests */
test("Fetching by invalid id -- faiure", async () => {
  const anyId = "123";
  tokenModel.findById = jest.fn().mockRejectedValue(new Error("error"));
  const user = await tokenServices.findTokenWithUserId(anyId);
  expect(user).toBeUndefined();
  expect(tokenModel.findById).toHaveBeenCalledWith(anyId);
});

test("Fetching by valid id and finding", async () => {
  const dummyToken = {
    userId: 123,
    token: "asdfasdf",
  };

  tokenModel.findById = jest.fn().mockResolvedValue(dummyToken);
  const foundUser = await tokenServices.findTokenWithUserId("randomid");
  expect(foundUser).toBeDefined();
  expect(foundUser.userId).toBe(dummyToken.userId);
  expect(foundUser.token).toBe(dummyToken.token);
});

test("check valid token -- fail", async () => {
  const anyId = "123";
  tokenModel.findOne = jest.fn().mockRejectedValue(new Error("error"));
  const user = await tokenServices.checkValidToken(anyId, "asdfasdf");
  expect(user).toBeUndefined();
});

test("check valid token -- success", async () => {
  const dummyToken = {
    userId: 123,
    token: "asdfasdf",
  };

  tokenModel.findOne = jest.fn().mockResolvedValue(dummyToken);
  const foundUser = await tokenServices.checkValidToken(123, "asdfasdf");
  expect(foundUser).toBeDefined();
  expect(foundUser.userId).toBe(dummyToken.userId);
  expect(foundUser.token).toBe(dummyToken.token);
});

test("add token -- success", async () => {
  const mockObjectId = new mongoose.Types.ObjectId();
  const addedToken = {
    userId: mockObjectId,
    token: "asdfasdf",
  };
  const tokenToAdd = {
    userId: mockObjectId,
    token: "asdfasdf",
  };
  mockingoose(tokenModel).toReturn(addedToken, "save");
  const user = await tokenServices.addToken(tokenToAdd);
  expect(user).toBeTruthy();
  expect(user).toHaveProperty("userId");
  expect(user).toHaveProperty("token");
});

test("delete token -- success", async () => {
  const deletedToken = {
    userId: 123,
    token: "asdfasdf",
  };
  mockingoose(tokenModel).toReturn(deletedToken, "deleteOne");
  const user = await tokenServices.deleteToken("asdfasdf");
  expect(user).toBeTruthy();
});
