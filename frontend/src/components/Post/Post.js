import { React, useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { RiPlayListAddLin, RiPlayListFill, RiUserLocationFill } from "react-icons/ri";
import { MdBookmark, MdBookmarkAdd } from "react-icons/md";
import { BsBookmarkHeartFill, BsBookmarkHeart } from "react-icons/bs";
import { TiLocation } from "react-icons/ti";
import { GrLocationPin } from "react-icons/gr";
import "./Post.css";
import "reactjs-popup/dist/index.css";
import Spotify from "react-spotify-embed";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Popup from "reactjs-popup";

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

const useStyles = makeStyles((theme) => ({
    quantityRoot: {
        color: "#FFFFFF",
        backgroundColor: "#303039",
        opacity: 0.6,
        borderRadius: "5px",
        "&:hover": {
            backgroundColor: "#1E1E24",
            borderRadius: "5px",
            opacity: 1,
        },
        "&:focus-within": {
            backgroundColor: "#1E1E24",
            borderRadius: "5px",
            opacity: 1,
        },
        "& .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #484850",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #484850",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #484850",
            borderRadius: "5px 5px 0 0",
        },
        "& .Mui-disabled": {
            color: "#FFFFFF",
            opacity: 0.6,
        },
        "& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #484850",
        },
    },
    selectRoot: {
        color: "#FFFFFF",
    },
    icon: {
        color: "#FFFFFF",
    },
    selectPaper: {
        backgroundColor: "#1E1E24",
        border: "1px solid #484850",
        borderRadius: "5px",
        color: "#FFFFFF",
        "& li:hover": {
            backgroundColor: "#303039",
        },
    },
}));

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
    let message = "< 1 hour ago";
    if (timePosted) {
        if (timePosted < 2) {
            message = "1 hour ago";
        } else if (timePosted < 24) {
            message = `${timePosted} hours ago`;
        } else if (timePosted < 25) {
            message = "1 day ago";
        } else {
            message = `${Math.ceil(parseInt(timePosted) / 24)} days ago`;
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
                uris: [uri],
                // position: 0,
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
                <Spotify wide allowtransparency="false" height="118px" link={url} />
                <div className="spotify-actions">
                    <button className="webplayer-buttons" onClick={spotifyLike}>
                        <BsBookmarkHeart />
                        {'Save to "Liked Songs"'}
                    </button>

                    {/* {liked === false ? (
                        <button className="webplayer-buttons" onClick={spotifyLike}>
                            <BsBookmarkHeart />
                            {'Save to "Liked Songs"'}
                        </button>
                    ) : (
                        <button className="webplayer-buttons" onClick={spotifyLike}>
                            <BsBookmarkHeartFill />
                            {'Saved to "Liked Songs"'}
                        </button>
                    )} */}
                    <Popup
                        // closeOnDocumentClick
                        modal
                        nested
                        trigger={
                            <button className="webplayer-buttons">
                                {" "}
                                <RiPlayListFill />
                                {"Add to playlist"}
                            </button>
                        }
                    >
                        {(close) => (
                            <div className="modal">
                                <button className="close" onClick={close}>
                                    &times;
                                </button>
                                <div className="content">
                                    <FormControl sx={{ m: 1, width: "100%" }}>
                                        <InputLabel id="demo-multiple-name-label">
                                            Choose a playlist...
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
                                                    >
                                                        {playlist.name}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                        )}
                    </Popup>
                </div>
            </div>
            <div className="action">
                <p className="time">{message}</p>
                <p className="location">{location}</p>
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
                        <FaHeart /> {likes}
                    </button>
                )}
            </div>
        </div>
    );
}

export default Post;