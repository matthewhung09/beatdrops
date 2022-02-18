import styled from 'styled-components';
import { React, useState, useEffect } from "react";
import { IoIosAddCircle } from 'react-icons/io';
import 'reactjs-popup/dist/index.css';
import './App.css';
import Popup from 'reactjs-popup';
import Post from './components/Post/Post';
import PostForm from './components/PostForm/PostForm';
import Dropdown from './components/Dropdown/Dropdown';
import axios from 'axios';
import SignUpForm from './components/SignUpForm/SignUpForm';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SpotifyLogin from './components/SpotifyLogin/SpotifyLogin';
import LoginForm from './components/LoginForm/LoginForm';
import Login from './Login';
import Dashboard from './Dashboard'

const Header = styled.div`
  text-align: center;
  margin-top: 2em;
  line-height: 1.5em;
`;
const code = new URLSearchParams(window.location.search).get('code');
const user = {
  username: "Mike",
  password: "cat123"

}
function App() {
  const [newSong, setNewSong] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [postList, setPosts] = useState([]); // used for creating new post and setting initial array

  // filter
  const [selected, setSelected] = useState('Default');

  // 'liked' set to false as default in the database
  // loop through each post that user has liked and change status
  useEffect(() => {
    getAllPosts().then( result => {
      if (result) {
        setPosts(result);
      }
    });
  }, [] );

  async function getAllPosts() {
    try {
      const response = await axios.get('http://localhost:5000/posts');
      return response.data;
    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (selected === 'Likes') {
      setPosts([...postList].sort((a, b) => b.likes - a.likes));
    }
    else if (selected === 'Recent') {
      setPosts([...postList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
    else {
      setPosts(postList);
    }
  }, [selected]);

  function onSubmitPostClick() { // Submit for making new post
    makePostCall().then(result => {
      if (result && result.status === 201) {
        setPosts([result.data, ...postList]);
      }
    }); 
  }

  async function makePostCall() {
    try {
      const response = await axios.post('http://localhost:5000/create', {
        'title': newSong,
        'artist': newArtist,
      });
      return response;
    }
    catch (error) {
      console.log(error);
      return false;
    }
  }

  function updateLikes(id) {
    let objIndex = postList.findIndex((obj) => obj._id === id);
    let elem = postList[objIndex];
    makeLikeCall(id, elem.liked).then( result => {
      if (result && result.status === 201) {
        elem.liked = !elem.liked; 
        elem.likes = result.data.likes;
        let newArr = [...postList.slice(0, objIndex), elem, ...postList.slice(objIndex+1)];
        setPosts(newArr);
      }
    })
  }

  // send ID of post and user - add liked post to their array
  async function makeLikeCall(id, liked) {
    try {
      const response = await axios.patch('http://localhost:5000/like/' + id, {liked: liked});
      return response;
    }
    catch (error) {
      console.log(error);
      return false;
    }
  }

  return (
    <div className='App'>
      {/* routed from login, routes to main page */}
      <Router>
        <Routes>
          <Route path="/" 
            element={<LoginForm/>} 
          />
          <Route path="/signup" 
            element={<SignUpForm/>} 
          />
          <Route path="/spotify" 
            element={
              <SpotifyLogin/>
            }
          />
          <Route path="/home" 
            element={
              <div className='home'>
                <Header>
                  <h1>beatdrops</h1>
                  <h2><i>YikYak meets Spotify</i></h2>
                </Header>
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
                              onClick={onSubmitPostClick}
                              onChangeSong={(e) => setNewSong(e.target.value)}
                              onChangeArtist={(e) => setNewArtist(e.target.value)}
                            />
                        </div>
                      </div>
                    )}
                  </Popup>
                </div>
                <div className='posts'>
                  {postList.map((post, index) => 
                    <Post key={index}
                        song={post.title}
                        artist={post.artist}
                        timePosted={parseInt((new Date() - new Date(post.createdAt)) / 3600000)}
                        likes={post.likes}
                        liked={post.liked}
                        url={post.url}
                        updateLikes={() => updateLikes(post._id)}
                        album={post.album}
                    />
                  )}
                </div>
              </div>
            } 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
