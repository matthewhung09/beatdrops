import styled from "styled-components";
import { React, useState, useEffect } from "react";
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
import data from "./data.js";
import Dashboard from "./Dashboard";
import { useCookies } from "react-cookie";
import { nominatim } from "nominatim-geocode";

const Header = styled.div`
    text-align: center;
    margin-top: 2em;
    line-height: 1.5em;
`;
// const code = new URLSearchParams(window.location.search).get("code");
let user;

function App() {
    const [newSong, setNewSong] = useState("");
    const [newArtist, setNewArtist] = useState("");
    const [postList, setPosts] = useState([]); // used for creating new post and setting initial array

    const [cookies, setCookie, removeCookie] = useCookies();

    // filter
    const [selected, setSelected] = useState("Default");

    useEffect(() => {
        getAllPosts().then((result) => {
            if (result) {
                console.log(result);
                setPosts(result.posts);
                user = result.user;
            }
        });
    }, []);

    async function getAllPosts() {
        try {
            const response = await axios.get(
                "http://localhost:5000/posts/" + cookies.jwt
            );
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

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

    function onSubmitPostClick() {
        // Submit for making new post
        makePostCall().then((result) => {
            if (result && result.status === 201) {
                setPosts([result.data, ...postList]);
            }
        });
    }

    async function makePostCall() {
        const location = await getPostPosition(lat, long);
        // console.log("gpos: ", gpos);
        // getPostPosition(lat, long);
        try {
            const response = await axios.post("http://localhost:5000/create", {
                title: newSong,
                artist: newArtist,
                location: location,
            });
            return response;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

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

    /* ------ geolocation start ------ */

    const [lat, setLat] = useState();
    const [long, setLong] = useState();
    // const [location, setLocation] = useState();

    useEffect(() => {
        const handleLocation = () => {
            navigator.geolocation.getCurrentPosition((position) => {
                setLat(position.coords.latitude);
                setLong(position.coords.longitude);
            });
        };

        if (navigator.geolocation) {
            navigator.permissions.query({ name: "geolocation" }).then(function (result) {
                if (result.state !== "denied") {
                    console.log(result.state);
                    handleLocation();
                }
            });
        }

        // getPostPosition(lat, long);
    }, [lat, long]);

    //function to get location coordinates
    async function getPostPosition(lat, long) {
        console.log("(lat, long): ", lat, long);
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${long}`;

        try {
            const response = await axios.get(url);
            // setLocation(response.data.address.road);
            console.log(response.data);
            // if (response.data.name !== undefined) return response.data.name;
            return response.data.address.road;
            // return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    /* ------ geolocation end ------ */

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
                                <Header>
                                    <h1>beatdrops</h1>
                                    <h2>
                                        <i>YikYak meets Spotify</i>
                                    </h2>
                                </Header>
                                <div className="home-actions">
                                    <Dropdown
                                        selected={`Filtered by: ${selected}`}
                                        setSelected={setSelected}
                                    />
                                    <Popup
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
                                                    <PostForm
                                                        newSong={newSong}
                                                        newArtist={newArtist}
                                                        onClick={onSubmitPostClick}
                                                        onChangeSong={(e) =>
                                                            setNewSong(e.target.value)
                                                        }
                                                        onChangeArtist={(e) =>
                                                            setNewArtist(e.target.value)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </Popup>
                                </div>
                                <div className="posts">
                                    {user !== undefined
                                        ? postList.map((post, index) => (
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
                                                  updateLikes={() =>
                                                      updateLikes(post._id)
                                                  }
                                                  location={post.location}
                                              />
                                          ))
                                        : postList.map((post, index) => (
                                              <Post
                                                  key={index}
                                                  timePosted={parseInt(
                                                      (new Date() -
                                                          new Date(post.createdAt)) /
                                                          3600000
                                                  )}
                                                  likes={post.likes}
                                                  liked={post.liked}
                                                  url={post.url}
                                                  updateLikes={() =>
                                                      updateLikes(post._id)
                                                  }
                                                  location={post.location}
                                              />
                                          ))}
                                </div>
                            </div>
                        }
                    />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
