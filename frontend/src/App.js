import styled from 'styled-components';
import React from "react";
import './App.css';
import Home from './components/Home/Home';
import data from './data.js';
import 'reactjs-popup/dist/index.css';
import './popup.css';
import Popup from 'reactjs-popup';
import PostForm from './components/PostForm/PostForm';
import axios from 'axios';
import { IoIosAddCircle } from "react-icons/io";

const Header = styled.div`
  text-align: center;
  padding: 1.2em;
`;

function App() {
  const [newSong, setNewSong] = React.useState('');
  const [newArtist, setNewArtist] = React.useState('');
  const [postList, addNewPost] = React.useState(data);

  function onChangeSong(e) {
    setNewSong(e.target.value);
  }

  function onChangeArtist(e) {
    setNewArtist(e.target.value);
  }

  function onClick() {
    makePostCall().then(result => {
      if (result && result.status === 201) {
        let newPostList = postList.concat(
          {
            'song': newSong, 
            'artist': newArtist,
            'timePosted': 100,
            'likes': 5,
            'url': result.data
          }
        );
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

  return (
    <div className='app-container'>
      {/* ------- Header ------- */}
      <Header>
        <h1>beatdrops</h1>
        <h2><i>YikYak meets Spotify</i></h2>
      </Header>

      {/* ------- New post popup ------- */}
      <Popup
        trigger={<button className="create-btn"> Create a new post <IoIosAddCircle></IoIosAddCircle></button>}
        modal
        nested
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

      {/* ------- All posts ------- */}
      <Home posts={postList}/>
    </div>
  );
}

export default App;
