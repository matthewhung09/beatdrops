import * as React from "react";
import "reactjs-popup/dist/index.css";
import "./Home.css";
import { useState, useEffect, useRef } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { RiRoadMapLine } from "react-icons/ri";

import Popup from "reactjs-popup";
import Post from "../Post/Post";
import PostForm from "../PostForm/PostForm";
import Dropdown from "../Dropdown/Dropdown";
import axios from "axios";
import rateLimit from "axios-rate-limit";
import BeatDropMap from "../BeatDropMap/BeatDropMap";

const code = new URLSearchParams(window.location.search).get("code");

function Home() {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!code) return;
    axios
      .post(`${process.env.REACT_APP_URL}/auth/callback`, {
        auth_code: code,
      })
      .then((res) => {
        setExpiresIn(res.data.expiresIn);
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        window.history.pushState({}, null, "/home");
        return res.data.refreshToken;
      })
      .then((r) => {
        axios.post(
          `${process.env.REACT_APP_URL}/update`,
          { refreshToken: r },
          { withCredentials: true }
        );
      })
      .catch((error) => {
        console.log(error);
        // window.location = "/spotify"
      });
  }, [code]);

  useEffect(() => {
    if (isMounted.current) {
      if (!refreshToken) return;
      refresh();
      setInterval(refresh, (expiresIn - 60) * 1000);
    } else {
      isMounted.current = true;
    }
  }, [refreshToken]);

  function refresh() {
    axios
      .post(`${process.env.REACT_APP_URL}/auth/refresh`, {
        refreshToken,
      })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        setExpiresIn(res.data.expiresIn);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /* ------ useState setup ------ */
  const [user, setUser] = useState();
  //const [token, setToken] = useState("");
  const [postError, setPostError] = useState("");

  // post creation
  const [newSong, setNewSong] = useState("");
  const [newArtist, setNewArtist] = useState("");
  const [postList, setPosts] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState("");
  const postErrMsg = "Could not find specified song, please check your spelling.";

  // dropdowns
  const [selected, setSelected] = useState("Default"); // post filtering
  const [userSetting, setUserSetting] = useState(user); // logout

  // geolocation
  const [lat, setLat] = useState();
  const [long, setLong] = useState();

  // takes care of rate limiting issues
  const http = rateLimit(axios.create(), {
    maxRequests: 5, // 5 requests
    maxRPS: 1000, // per 1000 milliseconds
  });

  // Gets all posts
  // withCredentials : true allows us to send the cookie
  // Used to call getAllPosts, maybe refactor to use it still for testing purposes?
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const url = `${process.env.REACT_APP_URL}/posts?lat=${position.coords.latitude}&long=${position.coords.longitude}`;
      axios
        .get(url, { withCredentials: true })
        .then((response) => {
          setPosts(response.data.posts);
          setUser(response.data.user);
          setExpiresIn(3600);
          setRefreshToken(response.data.user.refresh_token);
          setUserSetting(response.data.user.username);
        })
        // Occurs when either invalid token or no token - redirects user back to login screen
        .catch((error) => {
          console.log(error.response.data);
          if (error.response.status === 401) {
            window.location.assign("/");
          }
        });
    });
  }, []);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
    setIsLoggedIn(true);
    getCurrentSong();
    getPlaylists();
    // getUsersPlaylist();
  }, [accessToken]);

  async function getCurrentSong() {
    await axios
      .post(`${process.env.REACT_APP_URL}/current`, { accessToken })
      .then((res) => {
        if (res) {
          if (res.data.song) {
            setCurrentlyPlaying(res.data.song);
            setNewSong(res.data.song.name);
            setNewArtist(res.data.song.artists[0].name);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const [playlists, setPlaylists] = useState([]);

  async function getPlaylists() {
    await axios
      .post(`${process.env.REACT_APP_URL}/playlists`, { accessToken })
      .then((res) => {
        if (res) {
          setPlaylists(res.data.playlists);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /* ------ post filtering ------ */

  useEffect(() => {
    if (selected === "Likes") {
      setPosts([...postList].sort((a, b) => b.likes - a.likes));
    } else if (selected === "Recent") {
      setPosts([...postList].sort((a, b) => new Date(b.lastPosted) - new Date(a.lastPosted)));
    } else {
      setPosts(postList);
    }
  }, [selected]);

  // send ID of post and user - add liked post to their array
  async function makeLikeCall(post_id, liked) {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_URL}/user/` + user._id + "/liked",
        {
          post: post_id,
          liked: liked,
        }
      );
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /* ------ post creation ------ */

  // Submit for making new post
  async function onSubmitPostClick() {
    let success = false;
    await makePostCall().then((result) => {
      if (result && result.status === 201) {
        setPosts([result.data, ...postList]);
        success = true;
      } else if (result.status === 200) {
        setPosts(postList);
        success = true;
      } else {
        success = false;
      }
    });
    return success;
  }

  function resetPostForm(close) {
    setNewSong("");
    setNewArtist("");
    setPostError("");
    close();
  }

  async function makePostCall() {
    const { postedLocation, onCampus } = await getPostPosition();
    getPostPosition(lat, long);
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/create`, {
        title: newSong,
        artist: newArtist,
        location: { name: postedLocation, lat: lat, long: long, onCampus: onCampus },
      });
      return response;
    } catch (error) {
      console.log("Post failed");
      return false;
    }
  }

  // Called when user likes a post
  function updateLikes(post_id) {
    let objIndex = postList.findIndex((obj) => obj._id === post_id);
    let elem = postList[objIndex];
    let liked = user.liked.includes(post_id);

    makeLikeCall(post_id, liked).then((result) => {
      if (result && result.status === 201) {
        user.liked = result.data.user.liked; // Gets updated user liked list
        elem.likes = result.data.post.likes;
        let newArr = [...postList.slice(0, objIndex), elem, ...postList.slice(objIndex + 1)];
        setPosts(newArr);
      }
    });
  }

  /* ------ logout ------ */

  useEffect(() => {
    const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${process.env.REACT_APP_REDIRECT}/home&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;
    if (userSetting === "Logout") {
      logout();
    } else if (userSetting === "Connect Spotify") {
      window.location.assign(AUTH_URL);
    } else if (userSetting === "Remove Spotify") {
      removeSpotifyAccess();
    }
  }, [userSetting]);

  function removeSpotifyAccess() {
    console.log("in");
    axios
      .post(`${process.env.REACT_APP_URL}/auth/remove`, {}, { withCredentials: true })
      .then(() => {
        window.location.assign("https://www.spotify.com/us/account/apps/");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function logout() {
    axios
      .get(`${process.env.REACT_APP_URL}/logout`, { withCredentials: true })
      .then(() => {
        window.location.assign("/");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /* ------ geolocation ------ */

  // get coordinates from navigator API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: "geolocation" }).then(function (result) {
        if (result.state !== "denied") {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLat(position.coords.latitude);
              setLong(position.coords.longitude);
            },
            (error) => {
              console.log(error);
            }
          );
        }
      });
    }
  }, [lat, long]);

  // use reverse geocoding API to get location based on coordinates
  async function getPostPosition() {
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=211461662e434824aa8bd651b237c69a`;

    try {
      const response = await http.get(url);
      let geoData = response.data.features[0].properties;

      // random off campus place
      if (geoData.name === undefined) return { postedLocation: geoData.street, onCampus: false };
      // not at a specific campus building
      else if (geoData.name === "California Polytechnic State University")
        return { postedLocation: geoData.street, onCampus: true };
      // strip number from on campus buildings
      else if (geoData.name.includes("("))
        return {
          postedLocation: geoData.name.substring(0, geoData.name.indexOf("(")),
          onCampus: true,
        };
      // by default, return name of place
      return { postedLocation: geoData.properties.name, onCampus: false };
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="home">
      <div className="user-settings">
        <Dropdown
          selected={userSetting}
          setSelected={setUserSetting}
          setLoggedIn={isLoggedIn}
          purpose="user"
        />
      </div>
      <div className="header">
        <h1>Beatdrops</h1>
        <picture>
          {" "}
          <img src="logo_app.png" width="150" height="80" />{" "}
        </picture>
        <h2>YikYak meets Spotify</h2>
      </div>
      <div className="home-actions">
        <Dropdown
          selected={`Filtered by: ${selected}`}
          setSelected={setSelected}
          purpose="filter"
        />
        <Popup
          closeOnDocumentClick
          modal
          nested
          trigger={
            <button className="create-btn">
              {" "}
              Post a song <IoIosAddCircle className="circle" />
            </button>
          }
          style={{
            minWidth: "40em",
          }}
        >
          {(close) => (
            <div className="modal">
              <button className="close" onClick={close}>
                &times;
              </button>
              <div className="content">
                <PostForm
                  playlists={playlists}
                  currentlyPlaying={currentlyPlaying}
                  newSong={newSong}
                  newArtist={newArtist}
                  onChangeSong={(e) => setNewSong(e.target.value)}
                  onChangeArtist={(e) => setNewArtist(e.target.value)}
                  onClick={async () => {
                    (await onSubmitPostClick()) ? resetPostForm(close) : setPostError(postErrMsg);
                  }}
                  postFromPlaylist={async (value) => {
                    let songInfo = value.split("by");
                    let title = songInfo[0];
                    let artist = songInfo[1];
                    setNewSong(title);
                    setNewArtist(artist);
                  }}
                  postError={postError}
                />
              </div>
            </div>
          )}
        </Popup>

        <Popup
          className="map-popup"
          closeOnDocumentClick
          modal
          nested
          trigger={
            <button className="create-btn">
              {" "}
              Map <RiRoadMapLine className="circle" />
            </button>
          }
        >
          {(close) => (
            <div className="modal">
              <button className="close" onClick={close}>
                &times;
              </button>
              <div className="map-content">
                <BeatDropMap lat={lat} long={long} posts={postList} />
              </div>
            </div>
          )}
        </Popup>
      </div>
      {user !== undefined ? (
        <div className="posts">
          {postList.map((post, index) => (
            <Post
              key={index}
              timePosted={parseInt((new Date() - new Date(post.lastPosted)) / 3600000)}
              likes={post.likes}
              liked={user.liked.includes(post._id)}
              uri={post.spotify_uri}
              url={post.url}
              updateLikes={() => updateLikes(post._id)}
              location={post.location.name}
              spotifyId={post.spotify_id}
              playlists={playlists}
              token={accessToken}
              //setAllPlaylist={setAllPlaylist}
            />
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Home;
