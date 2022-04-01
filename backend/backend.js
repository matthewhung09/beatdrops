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

const app = express();
const port = 5000;

// import Bottleneck from "bottleneck";
// Note: To support older browsers and Node <6.0, you must import the ES5 bundle instead.
var Bottleneck = require("bottleneck/es5");
const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 333,
});

dotenv.config();

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const auth_token = Buffer.from(`${client_id}:${client_secret}`, "utf-8").toString(
    "base64"
);

app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
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
        const posts = await postServices.getPostsByLocation(lat, long);
        res.status(201).json({ posts: posts, user: req.user });
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
    }
});

// Creates a new post and adds it to the database
app.post("/create", async (req, res) => {
    const new_post = await limiter.schedule(() =>
        getPostData(req.body.title, req.body.artist, req.body.location)
    );

    if (!new_post) {
        res.status(500).end();
    } else {
        let post = await postServices.addPost(new_post);
        if (post) {
            res.status(201).json(post);
        } else {
            res.status(500).end();
        }
    }
});

// Queries Spotify API to get song information
async function getPostData(song, artist, location) {
    const data = {
        type: "track",
        limit: "10",
    };
    // Format querystring
    const first_part =
        "q=track:" +
        song.replaceAll(" ", "%20") +
        "%20artist:" +
        artist.replaceAll(" ", "%20");
    const second_part = new URLSearchParams(data).toString();
    const queryparam = first_part + "&" + second_part;

    const access_token = await getAccessToken();
    // const access_token = await limiter.schedule(() => getAccessToken());

    try {
        const response = await axios.get(
            "https://api.spotify.com/v1/search?" + queryparam,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );
        const song_url = response.data.tracks.items[0].external_urls.spotify;

        // Get actual song name and artist in case of mispellings/typos
        const song_name = response.data.tracks.items[0].name;
        const song_artist = response.data.tracks.items[0].artists[0].name;
        const spotify_id = response.data.tracks.items[0].id;

        const new_post = {
            title: song_name,
            artist: song_artist,
            likes: 0,
            url: song_url,
            location: location,
            spotify_id: spotify_id,
        };
        return new_post;
    } catch (error) {
        return false;
    }
}

// Get access token in order to use Spotify API
// This is different from /auth/login - here we use our developer credentials
// to get access token to make requests to API
async function getAccessToken() {
    try {
        const data = qs.stringify({
            grant_type: "client_credentials",
        });
        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            data,
            {
                headers: {
                    Authorization: `Basic ${auth_token}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.log(error);
    }
}

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

function createToken(id) {
    // payload, secret, options
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: 3600, // in SECONDS
    });
}

// Adds user to database upon signup
app.post("/signup", async (req, res) => {
    const new_user = req.body;
    try {
        // log user in instantaneously
        const user = await userServices.addUser(new_user);
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: 3600 * 1000 });
        res.status(201).json({ user: user });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userServices.login(email, password);
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: 3600 * 1000 });
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

app.get("/user/:id", async (req, res) => {
    const id = req.params["id"];
    const result = await userServices.findUserById(id);
    if (result === undefined || result === null)
        res.status(404).send("Resource not found.");
    else {
        res.send({ user: result });
    }
});

app.get("/user/:id/liked", async (req, res) => {
    const id = req.params["id"];
    const result = await userServices.getUserLiked(id);
    if (result === undefined || result === null)
        res.status(404).send("Resource not found.");
    else {
        res.send(result);
    }
});

// Handles user login - gets access token and reroutes them to redirect_uri
app.get("/auth/login", async (req, res) => {
    const auth_url = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;
    res.redirect(auth_url);
});

app.get("/auth/callback", async (req, res) => {
    const code = req.query.code;
    let response;

    try {
        const data = qs.stringify({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: redirect_uri,
        });
        response = await axios.post("https://accounts.spotify.com/api/token", data, {
            headers: {
                Authorization: `Basic ${auth_token}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
    } catch (error) {
        console.log(error);
    }

    res.redirect("http://localhost:3000/home/?token=" + response.data.access_token);
    // res.json({
    //     accessToken: response.data.access_token,
    //     refreshToken: response.data.refresh_token,
    //     expiresIn: response.data.expires_in,
    // });
});

// Gets current playing song
app.post("/current", async (req, res) => {
    const accessToken = req.body.token;
    if (accessToken === undefined) {
        return;
    }
    let response;
    try {
        response = await axios.get(
            "https://api.spotify.com/v1/me/player/currently-playing",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
        res.json({
            song: response.data.item,
        });
    } catch (error) {
        // console.log(error);
        return false;
    }
});

// Gets users' playlists
app.post("/playlists", async (req, res) => {
    const accessToken = req.body.token;
    const baseURI = "https://api.spotify.com/v1";
    if (accessToken === undefined) {
        return;
    }
    try {
        let response = await axios.get(`${baseURI}/me/playlists`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        let playlists = [];
        for (let i = 0; i < response.data.items.length; i++) {
            playlists.push({
                name: response.data.items[i].name,
                id: response.data.items[i].id,
                tracks: await getTracks(response.data.items[i].id),
            });
        }
        let result = playlists.filter((playlist) => playlist.tracks.length > 0);
        res.json({
            playlists: result,
        });
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
});

async function getTracks(id) {
    const accessToken = await getAccessToken();
    const baseURI = "https://api.spotify.com/v1";
    try {
        let response = await axios.get(`${baseURI}/playlists/${id}/tracks`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });
        let tracks = [];
        for (let i = 0; i < response.data.items.length; i++) {
            tracks.push({
                artist: response.data.items[i].track.artists[0].name,
                title: response.data.items[i].track.name,
            });
        }
        return tracks;
    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
}

app.post("/playlistNames", async(req, res) => {

    const accessToken = req.body.token;

    if (accessToken === undefined) {
        return;
    }


    try {

            let response = await axios.get(
                "https://api.spotify.com/v1/me/playlists",
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            let userPlaylists = [];

        for (let i = 0; i < response.data.items.length; i++) {
            userPlaylists.push({
                name: response.data.items[i].name,
                id: response.data.items[i].id,
                
            });
        }
        
        res.json({
            allPlaylists: userPlaylists,
        });

    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }


});


app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
    res.send("Hello, World!");
});
