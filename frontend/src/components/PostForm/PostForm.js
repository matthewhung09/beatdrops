import React from "react";
import "./PostForm.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Popper from "@material-ui/core/Popper";

const styles = (theme) => ({
  popper: {
    maxWidth: "fit-content",
  },
});

const PopperMy = function (props) {
  return <Popper {...props} style={styles.popper} placement="bottom-start" />;
};

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
    postFromPlaylist(e.target.innerText);
  };

  function getAllSongs() {
    let allSongs = [];
    playlists.forEach((playlist) => {
      playlist.tracks.forEach((song) => {
        allSongs.push({
          playlist: playlist.name,
          ...song,
        });
      });
    });
    return allSongs;
  }

  return (
    <div className="form-container">
      <div className="form-content">
        <div className="inputs">
          <h1 className="header"> Post a song </h1>
          <div className="input-content">
            <h2>Song title</h2>
            <input value={newSong} onChange={onChangeSong} />
            <h2>Artist name</h2>
            <input value={newArtist} onChange={onChangeArtist} />
            {postError && <p> {postError} </p>}
          </div>
          <button onClick={onClick} className="btn">
            Post
          </button>
        </div>
        <div className="divider"></div>
        <div className="autofill">
          <div className="current">
            {currentlyPlaying && (
              <div>
                <h2 className="current">Currently streaming</h2>
                <p className="current">{currentlyPlaying.name}</p>
                <button onClick={postCurrent} className="btn">
                  Post
                </button>
              </div>
            )}
          </div>
          <div>
            <h2>Select from your playlists</h2>
            {playlists && (
              <Autocomplete
                PopperComponent={PopperMy}
                id="grouped-demo"
                options={getAllSongs().sort(
                  (a, b) => -b.playlistName.localeCompare(a.playlistName)
                )}
                groupBy={(song) => song.playlistName}
                getOptionLabel={(song) => `${song.title} by ${song.artist}`}
                isOptionEqualToValue={(option, value) =>
                  option.title === value.title && option.artist === value.artist
                }
                sx={{ width: 300 }}
                placement="bottom-start"
                renderInput={(params) => (
                  <TextField {...params} label="Search by title or artist..." />
                )}
                onChange={handleChange}
                style={{
                  width: "19em",
                }}
                renderOption={(props, song) => {
                  return (
                    <li {...props} key={Math.random()}>
                      {/* {option.name} */}
                      {song.title} by {song.artist}
                    </li>
                  );
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostForm;
