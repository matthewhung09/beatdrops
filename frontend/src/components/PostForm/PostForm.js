import React from 'react';
import './PostForm.css';

function PostForm({newSong, onChangeSong, newArtist, onChangeArtist, onClick, postCurrent, postError}) {
    return (
        <div className="form-container">
            <input 
                placeholder="Song title"
                value={newSong} 
                onChange={onChangeSong}
            />
            <input 
                placeholder="Artist name"
                value={newArtist} 
                onChange={onChangeArtist}
            />
            {postError ? <p> {postError} </p> : null }
            <div className="actions">
                <button onClick={onClick} className='btn'>Submit</button>
                <button onClick={postCurrent} className='btn'>Post Currently Playing Song</button>
            </div>
            <br/>
        </div>
    );
}

export default PostForm;
