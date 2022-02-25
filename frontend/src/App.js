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

const Header = styled.div`
  text-align: center;
  margin-top: 2em;
  line-height: 1.5em;
`;

axios.post('/api', (request, response) => {

  console.log(response.data);

});

function App() {
  const [newSong, setNewSong] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [postList, setPosts] = useState([]); // used for creating new post and setting initial array

  // filter
  const [selected, setSelected] = useState('Default');



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

  /* ------ geolocation start ------ */

  const [lat, setLat] = useState();
  const [long, setLong] = useState();

  useEffect(() => {
    const handleLocation = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
        // console.log(`${lat}, ${long}`);
        // console.log(long);
      });
    };

    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
        if (result.state === 'granted') {
          console.log(result.state);
          handleLocation();
        } else if (result.state === 'prompt') {
          console.log('prompt');
        } else if (result.state === 'denied') {
          console.log('Denied');
        }
      });
    }
  }, [lat, long]);

  /* ------ geolocation end ------ */

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
                  {/* {console.log("as;dlkf:", (lat, long))} */}
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
                      location={`${lat}, ${long}`}
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
