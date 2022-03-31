import React from "react";
import Dropdown from "../Dropdown/Dropdown";
import "./PostForm.css";

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
    return (
        <div className="form-container">
            {playlists &&
                playlists.map((playlist, index) => (
                    <div key={index}>
                        {playlist.tracks.length > 0 && <b>{playlist.name}:</b>}
                        {playlist.tracks.map((song, index) => (
                            <div key={index}>
                                <button
                                    onClick={postFromPlaylist(song.title, song.artist)}
                                    style={{ color: "black" }}
                                >
                                    {song.title} by {song.artist}
                                </button>
                            </div>
                        ))}
                    </div>
                ))}
            <h1 className="header"> Post a song </h1>
            {/* <Dropdown
                selected={userSetting}
                setSelected={setUserSetting}
                purpose="user"
            /> */}
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
        </div>
    );
}

export default PostForm;
