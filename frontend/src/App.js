import styled from "styled-components";
import * as React from "react";
import { useState, useEffect } from "react";
import { IoIosAddCircle } from "react-icons/io";
import "reactjs-popup/dist/index.css";
import "./App.css";
import Popup from "reactjs-popup";
import Post from "./components/Post/Post";
import PostForm from "./components/PostForm/PostForm";
import Dropdown from "./components/Dropdown/Dropdown";
import axios from "axios";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SpotifyLogin from "./components/SpotifyLogin/SpotifyLogin";
import LoginForm from "./components/LoginForm/LoginForm";
import rateLimit from "axios-rate-limit";
import Dashboard from './Dashboard'

const Header = styled.div`
    text-align: center;
    margin-top: 2em;
    line-height: 1.5em;
`;

function App() {
    /* ------ useState setup ------ */
    const [user, setUser] = useState();
    const [token, setToken] = useState("");
    const [postError, setPostError] = useState("");

    // post creation
    const [newSong, setNewSong] = useState("");
    const [newArtist, setNewArtist] = useState("");
    const [postList, setPosts] = useState([]);
    const [currentlyPlaying, setCurrentlyPlaying] = useState('');

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
        axios
            .get("http://localhost:5000/posts", { withCredentials: true })
            .then((response) => {
                setPosts(response.data.posts);
                setUser(response.data.user);
                setUserSetting(response.data.user.username);
            })
            // Occurs when either invalid token or no token
            .catch((error) => {
                console.log(error.response.data);
                // if (error.response.status === 401) {
                //     window.location.assign('/');
                // }
            });
    }, []);

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get("token");
        if (token) {
            setToken(token);
        }
    }, []);

    useEffect(() => {
        if (token === '') {
            return;
        }
        getCurrentSong();
            // .then(console.log(currentlyPlaying));
    }, [token] );

    async function getCurrentSong() {
        await axios.post('http://localhost:5000/current', {token})
            .then(res => {
                if (res) {
                    setCurrentlyPlaying(res.data.song);
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
            setPosts(
                [...postList].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )
            );
        } else {
            setPosts(postList);
        }
    }, [selected]);

    // send ID of post and user - add liked post to their array
    async function makeLikeCall(post_id, liked) {
        try {
            const response = await axios.patch(
                "http://localhost:5000/user/" + user._id + "/liked",
                { post: post_id, liked: liked }
            );
            return response;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /* ------ post creation ------ */

    // Submit for making new post
    async function onSubmitPostClick(song, artist) {
        let success = false;
        await makePostCall(song, artist).then((result) => {
            if (result && result.status === 201) {
                setPosts([result.data, ...postList]);
                success = true;
            }
            else {
                success = false;
            }
        });
        return success;
    }

    async function makePostCall(song, artist) {
        const location = await getPostPosition();
        // getPostPosition(lat, long);
        if (song && artist) {
            try {
                const response = await axios.post("http://localhost:5000/create", {
                    title: song,
                    artist: artist,
                    location: location,
                });
                return response;
            } catch (error) {
                return false;
            }
        }
        else {
            try {
                const response = await axios.post("http://localhost:5000/create", {
                    title: newSong,
                    artist: newArtist,
                    location: location,
                });
                return response;
            } catch (error) {
                return false;
            }
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
                let newArr = [
                    ...postList.slice(0, objIndex),
                    elem,
                    ...postList.slice(objIndex + 1),
                ];
                setPosts(newArr);
            }
        });
    }

    /* ------ logout ------ */

    useEffect(() => {
        const AUTH_URL =
            "https://accounts.spotify.com/authorize?client_id=31aab7d48ba247f2b055c23b5ac155d8&response_type=code&redirect_uri=http://localhost:5000/auth/callback&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";
        if (userSetting === "Logout") {
            logout();
        }
        else if (userSetting === "Settings") {
            window.location.assign(AUTH_URL);
        }
    }, [userSetting]);

    function logout() {
        axios
            .get("http://localhost:5000/logout", { withCredentials: true })
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
                    // console.log(result.state);
                    navigator.geolocation.getCurrentPosition((position) => {
                        setLat(position.coords.latitude);
                        setLong(position.coords.longitude);
                    });
                }
            });
        }
    }, [lat, long]);


    // use reverse geocoding API to get location based on coordinates
    async function getPostPosition() {
        const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=211461662e434824aa8bd651b237c69a`;

        try {
            // const response = await axios(url);
            const response = await http.get(url);
            let geoData = response.data.features[0].properties;

            // random off campus place
            if (geoData.name === undefined) return geoData.street;
            // not at a specific campus building
            else if (geoData.name === "California Polytechnic State University")
                return geoData.street;
            // strip number from on campus buildings
            else if (geoData.name.includes("("))
                return geoData.name.substring(0, geoData.name.indexOf("("));
            // by default, return name of place
            return geoData.properties.name;
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="App">
            {/* routed from login, routes to main page */}
            <Router>
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/signup" element={<SignUpForm />} />
                    <Route path="/spotify" element={<SpotifyLogin />} />
                    <Route
                        path="/home"
                        element={
                            <div className="home">
                                <div className="user-settings">
                                    <Dropdown
                                        selected={userSetting}
                                        setSelected={setUserSetting}
                                        purpose="user"
                                    />
                                </div>
                                <Header>
                                    <h1 className="title">beatdrops</h1>
                                    <h2>
                                        <i>YikYak meets Spotify</i>
                                    </h2>
                                </Header>
                                {/* {token !== undefined && token !== '' ? <Dashboard token={token}/> : null} */}
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
                                                Post a song{" "}
                                                <IoIosAddCircle className="circle" />
                                            </button>
                                        }
                                    >
                                        {(close) => (
                                            <div className="modal">
                                                <button className="close" onClick={close}>
                                                    &times;
                                                </button>
                                                <div className="header">
                                                    {" "}
                                                    Post a song{" "}
                                                </div>
                                                <div className="content">
                                                    <div>
                                                        Currently playing song: {currentlyPlaying.name}
                                                    </div>
                                                    <PostForm
                                                        newSong={newSong}
                                                        newArtist={newArtist}
                                                        onClick={async () => {
                                                            if (await onSubmitPostClick()) {
                                                                setNewSong("");
                                                                setNewArtist("");
                                                                setPostError("");
                                                                close();
                                                            }
                                                            else {
                                                                setPostError("Could not find specified song, please check your spelling.");
                                                            }
                                                        }}
                                                        postCurrent={async () => {
                                                            setNewSong(currentlyPlaying.name);
                                                            setNewArtist(currentlyPlaying.artists[0].name);
                                                            if (await onSubmitPostClick(currentlyPlaying.name, currentlyPlaying.artists[0].name)) {
                                                                setNewSong("");
                                                                setNewArtist("");
                                                                setPostError("");
                                                                close();
                                                            }
                                                            else {
                                                                setPostError("Could not find specified song, please check your spelling.");
                                                            } 
                                                        }}
                                                        onChangeSong={(e) =>
                                                            setNewSong(e.target.value)
                                                        }
                                                        onChangeArtist={(e) =>
                                                            setNewArtist(e.target.value)
                                                        }
                                                        postError={postError}
                                                    />
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
                                                timePosted={parseInt(
                                                    (new Date() -
                                                        new Date(post.createdAt)) /
                                                        3600000
                                                )}
                                                likes={post.likes}
                                                liked={user.liked.includes(post._id)}
                                                url={post.url}
                                                updateLikes={() => updateLikes(post._id)}
                                                location={post.location}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p>Loading...</p>
                                )}
                            </div>
                        }
                    />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
