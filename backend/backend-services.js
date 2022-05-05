const axios = require("axios");
const baseURI = "https://api.spotify.com/v1";
const qs = require("qs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const auth_token = Buffer.from(`${client_id}:${client_secret}`, "utf-8").toString("base64");

// Get access token in order to use Spotify API
// This is different from /auth/login - here we use our developer credentials
// to get access token to make requests to API
async function getAccessToken() {
  try {
    const data = qs.stringify({
      grant_type: "client_credentials",
    });
    const response = await axios.post("https://accounts.spotify.com/api/token", data, {
      headers: {
        Authorization: `Basic ${auth_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data.access_token;
  } catch (error) {
    return undefined;
  }
}

// Queries Spotify API to get song information
async function getPostData(song, artist, location) {
  const data = {
    type: "track",
    limit: "10",
  };
  // Format querystring
  const first_part =
    "q=track:" + song.replaceAll(" ", "%20") + "%20artist:" + artist.replaceAll(" ", "%20");
  const second_part = new URLSearchParams(data).toString();
  const queryparam = first_part + "&" + second_part;

  const access_token = await getAccessToken();
  // const access_token = await limiter.schedule(() => getAccessToken());

  try {
    const response = await axios.get(`${baseURI}/search?` + queryparam, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (response.data.tracks.items.length === 0) {
      return false;
    }
    const song_url = response.data.tracks.items[0].external_urls.spotify;

    // Get actual song name and artist in case of mispellings/typos
    const song_name = response.data.tracks.items[0].name;
    const song_artist = response.data.tracks.items[0].artists[0].name;
    const spotify_id = response.data.tracks.items[0].id;
    const spotify_uri = response.data.tracks.items[0].uri;

    const new_post = {
      title: song_name,
      artist: song_artist,
      likes: 0,
      reposts: 0,
      //lastPosted: new Date(),
      url: song_url,
      location: location,
      spotify_id: spotify_id,
      spotify_uri: spotify_uri,
    };

    return new_post;
  } catch (error) {
    return false;
  }
}

function createToken(id) {
  // payload, secret, options
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: 3600, // in SECONDS
  });
}

async function getPlaylists(accessToken) {
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
      tracks: await getTracks(response.data.items[i].id, accessToken, response.data.items[i].name),
    });
  }

  return playlists;
}

async function getTracks(id, token, playlistName) {
  let response = await axios.get(`${baseURI}/playlists/${id}/tracks`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  let tracks = [];
  for (let i = 0; i < response.data.items.length; i++) {
    tracks.push({
      artist: response.data.items[i].track.artists[0].name,
      title: response.data.items[i].track.name,
      playlistName: playlistName,
    });
  }

  return tracks;
}

// send email for password reset
async function sendEmail(email, link) {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      // secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `${process.env.EMAIL_USER}`,
      to: email,
      subject: "Reset your password on beatdrops.",
      html: `<p>Hello! Click this <a href="${link}"> link </a> to reset your password.</p>`,
    });

    console.log("email sent successfully");
  } catch (error) {
    console.log(error, "email failed to send");
  }
}

exports.getTracks = getTracks;
exports.getPlaylists = getPlaylists;
exports.createToken = createToken;
exports.getPostData = getPostData;
exports.getAccessToken = getAccessToken;
exports.sendEmail = sendEmail;
