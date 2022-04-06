import React from "react";
import "./PostForm.css";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

function PostForm({
    playlists,
    currentlyPlaying,
    newSong,
    newArtist,
    onChangeSong,
    onChangeArtist,
    onClick,
    postCurrent,
    postFromPlaylist,
    postError,
}) {
    const handleChange = (e) => {
        postFromPlaylist(e.target.value);
    };

    return (
        <div className="form-container">
            <h1 className="header"> Post a song </h1>
            {currentlyPlaying && (
                <div>
                    <h2 className="current-song">
                        Currently playing song: {currentlyPlaying.name}
                    </h2>
                    <button onClick={postCurrent} className="btn">
                        Post Currently Playing Song
                    </button>
                </div>
            )}
            <input placeholder="Song title" value={newSong} onChange={onChangeSong} />
            <input
                placeholder="Artist name"
                value={newArtist}
                onChange={onChangeArtist}
            />
            {postError && <p> {postError} </p>}
            <div className="actions">
                <button onClick={onClick} className="btn">
                    Submit
                </button>
            </div>
            <br />
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel htmlFor="grouped-native-select">
                    Select from my playlists
                </InputLabel>
                <Select
                    onChange={handleChange}
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
    );
}

export default PostForm;
