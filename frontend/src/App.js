import styled from 'styled-components';
import { React, useState, useEffect } from "react";
import { IoIosAddCircle } from 'react-icons/io';
import 'reactjs-popup/dist/index.css';
import './App.css';
import Popup from 'reactjs-popup';
import Post from './components/Post/Post';
import PostForm from './components/PostForm/PostForm';
import Dropdown from './components/Dropdown/Dropdown';
import data from './data.js';
import axios from 'axios';

const Header = styled.div`
  text-align: center;
  margin-top: 2em;
  line-height: 1.5em;
`;

function App() {
  // ------ post creation ------ 
  const [newSong, setNewSong] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [postList, addNewPost] = useState(data);
  // ------ filter ------ 
  const [selected, setSelected] = useState('Default');
  const [filtered, setFilter] = useState(postList);

  function onChangeSong(e) {
    setNewSong(e.target.value);
  }

  function onChangeArtist(e) {
    setNewArtist(e.target.value);
  }

  useEffect(() => {
    if (selected === 'Likes') {
      setFilter([...filtered].sort((a, b) => b.likes - a.likes));
    }
    else if (selected === 'Recent') {
      setFilter([...filtered].sort((a, b) => a.timePosted - b.timePosted));
    }
    else {
      setFilter(filtered);
    }
    console.log('in useEffect');
  }, [selected, filtered]);

  function onClick() {
    makePostCall().then(result => {
      if (result && result.status === 201) {
        let newPost = {
          'song': newSong, 
          'artist': newArtist,
          'timePosted': 100,
          'likes': 5,
          'liked': false,
          'url': result.data
        };
        let newPostList = [newPost].concat(postList);
        addNewPost(newPostList);
        console.log(postList);
      }
    }); 
  }

  async function makePostCall() {
    try {
      const response = await axios.post('http://localhost:5000/create', {
        'song': newSong,
        'artist': newArtist
      });
      return response;
    }
    catch (error) {
      console.log(error);
      return false;
    }
  }

  function updateLikes(id) {
    let newArr = filtered.map((elem) => {
      if (elem.id === id) {
        elem.liked = !elem.liked;
      }
      return elem;
    });
    setFilter(newArr);
  }

  return (
    <div className='App'>
      <Header>
        <h1>beatdrops</h1>
        <h2><i>YikYak meets Spotify</i></h2>
      </Header>
      <div className='home'>
        <div className='home-actions'>
          <Dropdown selected={`Filtered by: ${selected}`} setSelected={setSelected}/>
          <Popup modal nested trigger={<button className="create-btn"> Post a song <IoIosAddCircle className='circle'/></button>}
          >
            {close => (
              <div className="modal">
                <button className="close" onClick={close}>
                  &times;
                </button>
                <div className="header"> Post a song </div>
                <div className="content">
                    <PostForm
                      newSong={newSong}
                      newArtist={newArtist}
                      onClick={onClick}
                      onChangeSong={onChangeSong}
                      onChangeArtist={onChangeArtist}
                    />
                </div>
              </div>
            )}
          </Popup>
        </div>
        <div className='posts'>
          {filtered.map((post, index) => 
            // ----- for testing -----
            // <div>
            //   {post.likes} 
            //   <Post 
            //       song={post.song}
            //       artist={post.artist}
            //       timePosted={post.timePosted}
            //       likes={post.likes}
            //       liked={post.liked}
            //       url={post.url}
            //   />
            // </div>
            <Post key={index}
                song={post.song}
                artist={post.artist}
                timePosted={post.timePosted}
                likes={post.likes}
                liked={post.liked}
                url={post.url}
                updateLikes={() => updateLikes(post.id)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
