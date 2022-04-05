import { React, useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./Post.css";
import "reactjs-popup/dist/index.css";
import Spotify from "react-spotify-embed";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import axios from "axios";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function Post({
    timePosted,
    likes,
    liked,
    uri,
    url,
    updateLikes,
    location,
    spotifyLike,
    allPlaylists,
    token,
}) {
    // first part of location message based on post time
    let message = "Streamed less than an hour ago at";
    if (timePosted) {
        if (timePosted < 2) {
            message = "Streamed an hour ago at";
        } else if (timePosted < 24) {
            message = `Streamed ${timePosted} hours ago at`;
        } else if (timePosted < 25) {
            message = "Streamed a day ago at";
        } else {
            message = `Streamed ${Math.ceil(parseInt(timePosted) / 24)} days ago at`;
        }
    }

    const [selectedPlaylist, setSelectedPlaylist] = useState("");

    const handleChange = (e) => {
        setSelectedPlaylist(e.target.value);
        console.log(selectedPlaylist);
    };

    useEffect(() => {
        // console.log("should be in here");
        addToPlaylist();
    }, [selectedPlaylist]);

    async function addToPlaylist() {
        // takes care of undefined id on first render of useEffect
        if (selectedPlaylist !== "") {
            const id = findPlaylistId();
            const data = {
                uris: uri,
                position: 0,
            };
            console.log("data: ", data);
            console.log("id: ", id);
            try {
                const response = await axios.post(
                    `https://api.spotify.com/v1/playlists/${id}/tracks`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                console.log("response: ", response);
                return response;
            } catch (error) {
                console.log("error message: ", error.message);
                return false;
            }
        }
    }

    function findPlaylistId() {
        // console.log(allPlaylists);

        for (let i = 0; i < allPlaylists.length; i++) {
            let playlist = allPlaylists.find((item) => item.name === selectedPlaylist);
            if (playlist) return playlist.id;
        }
    }

    return (
        <div className="card">
            <div className="spotify-div">
                <Spotify wide allowtransparency="false" link={url} />
            </div>
            <div className="action">
                <p className="time">
                    {message}
                    <b className="location">{` ${location}`}</b>
                </p>
                {liked === false ? (
                    <button
                        className="likes"
                        onClick={updateLikes}
                        style={{ color: "black", backgroundColor: "rgb(236, 236, 236)" }}
                    >
                        <FaRegHeart />
                        {likes}
                    </button>
                ) : (
                    <button
                        className="likes"
                        onClick={updateLikes}
                        style={{ color: "#0065B8", backgroundColor: "#DCEFFE" }}
                    >
                        <FaHeart />
                        {likes}
                    </button>
                )}
                <button
                    className="likes"
                    onClick={spotifyLike}
                    style={{ color: "black", backgroundColor: "rgb(236, 236, 236)" }}
                >
                    {"Like on Spotify"}
                </button>

                <FormControl sx={{ m: 1, width: 180 }}>
                    <InputLabel id="demo-multiple-name-label">
                        Add to Playlist(s)
                    </InputLabel>
                    <Select
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        value={selectedPlaylist}
                        onChange={handleChange}
                        input={<OutlinedInput label="Name" />}
                        MenuProps={MenuProps}
                    >
                        {allPlaylists &&
                            allPlaylists.map((playlist, index) => (
                                <MenuItem
                                    key={index}
                                    value={playlist.name}
                                    //style={getStyles(name, personName, theme)}
                                >
                                    {playlist.name}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </div>
        </div>
    );
}

export default Post;
