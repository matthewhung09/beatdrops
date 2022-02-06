import styled from 'styled-components';
import { React, useState } from "react";
import './App.css';
import 'reactjs-popup/dist/index.css';
import './popup.css';
import Home from './components/Home/Home';
import data from './data.js';
import axios from 'axios';

const Header = styled.div`
  text-align: center;
  margin-top: 2em;
  line-height: 1.5em;
`;

function App() {
  const [newSong, setNewSong] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [postList, addNewPost] = useState(data);

  function onChangeSong(e) {
    setNewSong(e.target.value);
  }

  function onChangeArtist(e) {
    setNewArtist(e.target.value);
  }

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

  return (
    <div className='App'>
      <Header>
        <h1>beatdrops</h1>
        <h2><i>YikYak meets Spotify</i></h2>
      </Header>
      <Home posts={
          newSong, 
          newArtist, 
          onClick, 
          onChangeSong, 
          onChangeArtist, 
          postList
        }
      />
    </div>
  );
}

export default App;
