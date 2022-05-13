const express = require("express");
const res = require("express/lib/response");
const dotenv = require("dotenv");
const axios = require("axios");
const qs = require("qs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const postServices = require("./models/post-services");
const userServices = require("./models/user-services");
const checkUser = require("./middleware/authMiddleware");
const bodyParser = require("body-parser");
const backEndServices = require("./backend-services");
const tokenServices = require("./models/token-services");
const randomstring = require("random-string-gen");

const app = express();
const port = 5000;

const baseURI = "https://api.spotify.com/v1";
// import Bottleneck from "bottleneck";
// Note: To support older browsers and Node <6.0, you must import the ES5 bundle instead.
var Bottleneck = require("bottleneck/es5");
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 333,
});

dotenv.config();

const auth_token = Buffer.from(
  `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`,
  "utf-8"
).toString("base64");

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://beatdrops.herokuapp.com"],
  })
);

// app.options("*", cors());
app.use(express.json());
app.use(bodyParser.json());

const handleErrors = (err) => {
  let errors = { username: "", email: "", password: "" };

  if (err.message == "incorrect email") {
    errors.email = "Email is not registered.";
  }
  if (err.message == "incorrect password") {
    errors.password = "Password is incorrect.";
  }

  // validation errors
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      if (properties.message.includes("expected `email` to be unique")) {
        errors[properties.path] = "Email already in use.";
        return;
      }
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// Get all posts from the database
// Called on initial load
// checkUser validates the jwt, sets req.user to the user
app.get("/posts", checkUser, async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const long = parseFloat(req.query.long);
  try {
    const posts = await postServices.getPostsByLocation(lat, long, false);
    res.status(201).json({ posts: posts, user: req.user });
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error);
  }
});

// Creates a new post and adds it to the database
app.post("/create", async (req, res) => {
  const new_post = await limiter.schedule(() =>
    backEndServices.getPostData(req.body.title, req.body.artist, req.body.location)
  );
  if (!new_post) {
    res.status(500).end();
  } else {
    const dup = await postServices.findDuplicates(new_post);

    if (dup.length === 0) {
      let post = await postServices.addPost(new_post);
      if (post) {
        res.status(201).json(post);
      } else {
        res.status(500).end();
      }
    } else {
      let post = await postServices.updateDuplicate(new_post);
      if (post) {
        res.status(200).end();
      } else {
        res.status(500).end();
      }
    }
  }
});

// Update user array and post and then send back new post and user information
app.patch("/user/:id/liked", async (req, res) => {
  const id = req.params["id"];
  const post = req.body.post;
  const liked = req.body.liked;
  let updatedUser;
  let updatedPost = await postServices.updateLikeStatus(post, liked);
  if (liked) updatedUser = await userServices.removeUserLiked(id, post);
  else updatedUser = await userServices.addUserLiked(id, post);

  if (updatedUser && updatedPost) {
    res.status(201).json({
      post: updatedPost,
      user: updatedUser,
    });
  } else {
    res.status(404).send("Resource not found.");
  }
});

// Adds user to database upon signup
// Refactored the email check to here to avoid the validator in the schema
app.post("/signup", async (req, res) => {
  const new_user = req.body;
  try {
    const user = await userServices.addUser(new_user);
    if (user === undefined) {
      res.status(400).json({ errors: { email: "Email already in use" } });
    } else {
      const token = backEndServices.createToken(user._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3600 * 1000,
        secure: true,
        sameSite: "none",
      });
      res.status(201).json({ user: user });
    }
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userServices.login(email, password);
    const token = backEndServices.createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3600 * 1000,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ user: user });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
});

// Delete the cookie
app.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
});

app.post("/auth/callback", async (req, res) => {
  const code = req.body.auth_code;
  let response;
  try {
    const data = qs.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: process.env.FRONTEND_URL + "/home",
    });
    response = await axios.post("https://accounts.spotify.com/api/token", data, {
      headers: {
        Authorization: `Basic ${auth_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    res.json({
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

app.post("/auth/refresh", async (req, res) => {
  const refreshToken = req.body.refreshToken;
  let response;

  try {
    const data = qs.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });
    response = await axios.post("https://accounts.spotify.com/api/token", data, {
      headers: {
        Authorization: `Basic ${auth_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    res.json({
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

// Gets current playing song
//Has been refactored to correspond with backend-services.js
app.post("/current", async (req, res) => {
  const accessToken = req.body.accessToken;
  if (accessToken === undefined) {
    return;
  }
  let response;
  try {
    response = await axios.get(`${baseURI}/me/player/currently-playing`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    res.json({
      song: response.data.item,
    });
  } catch (error) {
    // console.log(error);
    return false;
  }
});

// Has been refactored to correspond with backend-services.js
// Gets users' playlists and tracks for posting from
// playlist functionality
app.post("/playlists", async (req, res) => {
  const accessToken = req.body.accessToken;
  if (accessToken === undefined) {
    return;
  }

  try {
    const result = await backEndServices.getPlaylists(accessToken);

    res.json({
      //json object
      playlists: result,
    });
  } catch (error) {
    res.status(500).send(error);
    // console.log(error);
  }
});

app.post("/update", checkUser, async (req, res) => {
  const refreshToken = req.body.refreshToken;
  const user_id = req.user._id;
  const user = await userServices.updateRefresh(user_id, refreshToken);
});

/* ------ password reset ------ */

app.post("/send-email", async (req, res) => {
  try {
    const user = await userServices.findUserByEmail(req.body.email);
    if (!user) {
      res.status(404).send({ message: "No user found with that email." });
    }

    let token = await tokenServices.findTokenWithUserId(user._id);
    // create token for user if one doesn't already exist
    if (!token) {
      const slug = randomstring();
      token = await tokenServices.addToken({
        userId: user._id,
        token: slug,
      });
    }

    // send email to user
    const link = `${process.env.FRONTEND_URL}/reset/${token.userId}/${token.token}`;
    await backEndServices.sendEmail(user.email, link);
    res.send("password reset link sent to your email account");
  } catch (error) {
    res.send("error occurred");
    console.log(error);
  }
});

app.post("/reset/:userId/:token", async (req, res) => {
  try {
    const user = await userServices.findUserById(req.params.userId);
    if (!user) {
      return res.status(400).send("invalid link or expired");
    }

    const token = await tokenServices.checkValidToken(user._id, req.params.token);
    if (!token) {
      return res.status(400).send("Invalid link or expired");
    }

    await userServices.resetPassword(user._id, req.body.password);
    await tokenServices.deleteToken(token);

    res.send("password reset sucessfully.");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
});

//remove spotify access
app.post("/auth/remove", checkUser, async (req, res) => {
  console.log("k0w46un94");
  const user_id = req.body._id;
  const user = await userServices.deleteSpotifyAccess(user_id);
  if (user) {
    res.status(204).end();
  } else {
    res.status(404).send("User not found");
  }
});

app.listen(process.env.PORT || port, () => {
  console.log(`listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
