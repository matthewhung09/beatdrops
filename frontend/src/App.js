import styled from 'styled-components';
import React from "react";
import './App.css';
import Home from './components/Home/Home';
import data from './data.js';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './popup.css';
import PostForm from './components/PostForm/PostForm';
import axios from 'axios';

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
    <div>
      <Header>
        <h1>Team F</h1>
        <h2><i>YikYak meets Spotify</i></h2>
      </Header>
      <PostForm
        newSong={newSong}
        newArtist={newArtist}
        onClick={onClick}
        onChangeSong={onChangeSong}
        onChangeArtist={onChangeArtist}
      />
      <Home posts={postList}/>
    </div>
  );
}

export default App;
