import { React, useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { RiPlayListFill } from "react-icons/ri";
import { BsBookmarkHeartFill, BsBookmarkHeart } from "react-icons/bs";
import "./Post.css";
import "reactjs-popup/dist/index.css";
import Spotify from "react-spotify-embed";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import axios from "axios";
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

function Post({
  timePosted,
  likes,
  liked,
  uri,
  url,
  updateLikes,
  location,
  // spotifyLike,
  playlists,
  spotifyId,
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

  /* ---- general Spotify constants ---- */

  const SPOTIFY_PREFIX = "https://api.spotify.com/v1";
  const HEADERS = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  /* ---- adding to Spotify playlist ---- */

  const [selectedPlaylist, setSelectedPlaylist] = useState("");

  const handleChange = (e) => {
    setSelectedPlaylist(e.target.value);
  };

  useEffect(() => {
    addToPlaylist();
  }, [selectedPlaylist]);

  async function addToPlaylist() {
    // takes care of undefined id on first render of useEffect
    if (selectedPlaylist !== "") {
      const id = findPlaylistId();
      const data = {
        uris: [uri],
      };
      try {
        const response = await axios.post(`${SPOTIFY_PREFIX}/playlists/${id}/tracks`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        return response;
      } catch (error) {
        return false;
      }
    }
  }

  function findPlaylistId() {
    let userPlaylists = [];

    for (let i = 0; i < playlists.length; i++) {
      userPlaylists.push({
        name: playlists[i].name,
        id: playlists[i].id,
      });
    }

    for (let i = 0; i < userPlaylists.length; i++) {
      let playlist = userPlaylists.find((item) => item.name === selectedPlaylist);

      if (playlist) return playlist.id;
    }
  }

  const [spotifyLikeStatus, setSpotifyLikeStatus] = useState(false);

  useEffect(() => {
    if (token === undefined) {
      return;
    }
    getSpotifyLikeStatus();
  }, [token, spotifyId]);

  async function getSpotifyLikeStatus() {
    if (spotifyId === undefined) {
      return;
    }
    const queryparam = `ids=${spotifyId}`;
    try {
      const status = await axios.get(`${SPOTIFY_PREFIX}/me/tracks/contains?` + queryparam, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setSpotifyLikeStatus(status.data[0]);
    } catch (error) {
      return false;
    }
  }

  /* ---- handle likes/unlikes on Spotify ---- */

  // add to "Liked Songs"
  async function likeOnSpotify() {
    const data = {
      ids: [spotifyId],
    };
    try {
      let response = await axios.put(`${SPOTIFY_PREFIX}/me/tracks`, data, { headers: HEADERS });
      setSpotifyLikeStatus(true);
      return response;
    } catch (error) {
      console.log(error.status);
      return false;
    }
  }

  // remove from "Liked Songs"
  async function unlikeOnSpotify() {
    const data = {
      ids: [spotifyId],
    };
    try {
      let response = await axios.delete(`${SPOTIFY_PREFIX}/me/tracks`, {
        headers: HEADERS,
        data: data,
      });
      setSpotifyLikeStatus(false);
      return response;
    } catch (error) {
      console.log(error.status);
      return false;
    }
  }

  return (
    <div className="card">
      <div className="spotify-div">
        <Spotify wide allowtransparency="false" height="118px" link={url} />
        <div className="spotify-actions">
          {spotifyLikeStatus === false ? (
            <button className="webplayer-buttons" onClick={likeOnSpotify}>
              {console.log("liked")}
              <BsBookmarkHeart />
              {'Save to "Liked Songs"'}
            </button>
          ) : (
            <button className="webplayer-buttons" onClick={unlikeOnSpotify}>
              {console.log("unliked")}
              <BsBookmarkHeartFill />
              {'Saved to "Liked Songs"'}
            </button>
          )}
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
                    <InputLabel id="demo-multiple-name-label">Choose a playlist...</InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      value={selectedPlaylist}
                      onChange={handleChange}
                      input={<OutlinedInput label="Name" />}
                      MenuProps={MenuProps}
                    >
                      {playlists &&
                        playlists.map((playlist, index) => (
                          <MenuItem key={index} value={playlist.name}>
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
