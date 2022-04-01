import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./Post.css";
import "reactjs-popup/dist/index.css";
import Spotify from "react-spotify-embed";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

function Post({ timePosted, likes, liked, url, updateLikes, location, spotifyLike, playlists}) {
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

                <FormControl sx={{ m: 1, minWidth: 200 }}>
                <InputLabel htmlFor="grouped-native-select">
                    Add Song to Playlist
                </InputLabel>
                <Select
                    
                    native
                    defaultValue=""
                    id="grouped-native-select"
                    // label="grouping"
                >
                    <option aria-label="None" value="" />
                    {playlists &&
                        playlists.map((playlist, index) => (
                            <optgroup key={index} label={playlist.name}>
                                {playlist.tracks.map((song, index) => (
                                    <option
                                        key={index}
                                        value={`${song.title}, ${song.artist}`}
                                    >
                                        {song.title} by {song.artist}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                </Select>
            </FormControl>

            </div>
        </div>
    );
}


export default Post;
