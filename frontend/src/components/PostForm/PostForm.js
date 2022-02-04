import React from 'react';
import './PostForm.css';

function PostForm({newSong, onChangeSong, newArtist, onChangeArtist, onClick}) {
    return (
        <div>
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
            <button onClick={onClick} className='btn'>Add</button>
            <br/>
        </div>
    );
}

export default PostForm;
