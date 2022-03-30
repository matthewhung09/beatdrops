import React from "react";
import "./PostForm.css";

function PostForm({
    currentlyPlaying,
    newSong,
    onChangeSong,
    newArtist,
    onChangeArtist,
    onClick,
    postCurrent,
    postError,
}) {
    return (
        <div className="form-container">
            <h1 className="header"> Post a song </h1>
            {currentlyPlaying && (
                <h2 className="current-song">
                    Currently playing song: {currentlyPlaying.name}
                </h2>
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
                <button onClick={postCurrent} className="btn">
                    Post Currently Playing Song
                </button>
            </div>
            <br />
        </div>
    );
}

export default PostForm;
