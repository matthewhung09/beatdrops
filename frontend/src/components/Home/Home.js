import * as React from "react";
import "reactjs-popup/dist/index.css";
import "./Home.css";
import { useState, useEffect } from "react";
import { IoIosAddCircle } from "react-icons/io";
import Popup from "reactjs-popup";
import Post from "../Post/Post";
import PostForm from "../PostForm/PostForm";
import Dropdown from "../Dropdown/Dropdown";
import axios from "axios";
import rateLimit from "axios-rate-limit";

function Home() {
    /* ------ useState setup ------ */
    const [user, setUser] = useState();
    const [token, setToken] = useState("");
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
            const url = `http://localhost:5000/posts?lat=${position.coords.latitude}&long=${position.coords.longitude}`;
            axios
                .get(url, { withCredentials: true })
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
        });
    }, []);

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get("token");
        if (token) {
            setToken(token);
        }
    }, []);

    useEffect(() => {
        if (token === "") {
            return;
        }
        getCurrentSong();
        getPlaylists();
        getUsersPlaylist();
        findPlaylistSong();
    }, [token]);

    async function getCurrentSong() {
        await axios
            .post("http://localhost:5000/current", { token })
            .then((res) => {
                if (res) {
                    // console.log("hello");
                    // console.log("Before: " + currentlyPlaying);
                    setCurrentlyPlaying(res.data.song);
                    // console.log("After: " + currentlyPlaying);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const [playlists, setPlaylists] = useState([]);

    async function getPlaylists() {
        // console.log("in getplaylists");
        await axios
            .post("http://localhost:5000/playlists", { token })
            .then((res) => {
                if (res) {
                    console.log("res: " + JSON.stringify(res.data.playlists));
                    setPlaylists(res.data.playlists);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const [allPlaylists, setAllPlaylist] = useState([]);

    async function getUsersPlaylist() {

        await axios
            .post("http://localhost:5000/playlistNames", { token })
            .then((res) => {
                if(res) {
                    console.log("info: " + JSON.stringify(res.data.allPlaylists));
                    setAllPlaylist(res.data.allPlaylists);
                }
            })
            .catch((error) => {
                console.log(error);
            })


    }

    function findPlaylistSong(artist, title) {
        for (let i = 0; i < playlists.length; i++) {
            let song = playlists[0].tracks.find(
                (item) => item.artist === artist && item.title === title
            );
            if (song) return song;
        }
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

    async function makePostCall(song, artist) {
        const location = await getPostPosition();
        // getPostPosition(lat, long);
        if (song && artist) {
            try {
                const response = await axios.post("http://localhost:5000/create", {
                    title: song,
                    artist: artist,
                    location: { name: location, lat: lat, long: long },
                });
                return response;
            } catch (error) {
                return false;
            }
        } else {
            try {
                const response = await axios.post("http://localhost:5000/create", {
                    title: newSong,
                    artist: newArtist,
                    location: { name: location, lat: lat, long: long },
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

    async function spotifyLike(spotify_id) {
        console.log(spotify_id);
        const data = {
            ids: [spotify_id],
        };
        try {
            const response = await axios.put(
                "https://api.spotify.com/v1/me/tracks",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(response);
            return response;
        } catch (error) {
            return false;
        }
    }

    /* ------ logout ------ */

    useEffect(() => {
        const AUTH_URL =
            "https://accounts.spotify.com/authorize?client_id=31aab7d48ba247f2b055c23b5ac155d8&response_type=code&redirect_uri=http://localhost:5000/auth/callback&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";
        if (userSetting === "Logout") {
            logout();
        } else if (userSetting === "Spotify") {
            window.location.assign(AUTH_URL);
        }
    }, [userSetting]);

    function logout() {
        axios
            .get("http://localhost:5000/logout", { withCredentials: true })
            .then(() => {
                console.log("here");
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
        <div className="home">
            <div className="user-settings">
                <Dropdown
                    selected={userSetting}
                    setSelected={setUserSetting}
                    purpose="user"
                />
            </div>
            <div className="header">
                <h1>beatdrops</h1>
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
                                        (await onSubmitPostClick())
                                            ? resetPostForm(close)
                                            : setPostError(postErrMsg);
                                    }}
                                    postCurrent={async () => {
                                        setNewSong(currentlyPlaying.name);
                                        setNewArtist(currentlyPlaying.artists[0].name);
                                        (await onSubmitPostClick(
                                            currentlyPlaying.name,
                                            currentlyPlaying.artists[0].name
                                        ))
                                            ? resetPostForm(close)
                                            : setPostError(postErrMsg);
                                    }}
                                    postFromPlaylist={async (value) => {
                                        let songInfo = value.split(",");
                                        let title = songInfo[0];
                                        let artist = songInfo[1];
                                        setNewSong(title);
                                        setNewArtist(artist);
                                        (await onSubmitPostClick(title, artist))
                                            ? resetPostForm(close)
                                            : setPostError(postErrMsg);
                                    }}
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
                                (new Date() - new Date(post.createdAt)) / 3600000
                            )}
                            likes={post.likes}
                            liked={user.liked.includes(post._id)}
                            url={post.url}
                            updateLikes={() => updateLikes(post._id)}
                            location={post.location.name}
                            spotifyLike={() => spotifyLike(post.spotify_id)}
                            allPlaylists={allPlaylists}
                            setAllPlaylist={setAllPlaylist}
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
