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
  const [newSong, setNewSong] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [postList, setPosts] = useState([]); // used for creating new post and setting initial array
  // filter
  const [selected, setSelected] = useState('Default');
  // const [postList, setPosts] = useState(postList); // used for filtering when toggling dropdown
  
  useEffect(() => {
    getAllPosts().then( result => {
      if (result) {
        setPosts(result);
        console.log('in useEffect postList: ' + postList); 
      }
    });
  }, [] );

  async function getAllPosts() {
    try {
      const response = await axios.get('http://localhost:5000/posts');
      console.log(response.data.post_list);
      return response.data.post_list;
    }
    catch (error) {
      console.log(error);
    }
  }

  function onChangeSong(e) {
    setNewSong(e.target.value);
  }

  function onChangeArtist(e) {
    setNewArtist(e.target.value);
  }

  // useEffect(() => {
  //   // console.log(postList);
  //   // console.log(postList);
  //   if (selected === 'Default') {
  //     setPosts(postList);
  //   }
  // }, []);


  useEffect(() => {
    // console.log(postList);
    // console.log(postList);
    if (selected === 'Likes') {
      setPosts([...postList].sort((a, b) => b.likes - a.likes));
    }
    else if (selected === 'Recent') {
      setPosts([...postList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
    else {
      setPosts(postList);
    }
    console.log('in useEffect');
  }, [selected]);

  function onClick() {
    makePostCall().then(result => {
      if (result && result.status === 201) {
        setPosts([result.data, ...postList]);
        // console.log(postList);
      }
    }); 
  }

  async function makePostCall() {
    try {
      const response = await axios.post('http://localhost:5000/create', {
        'song': newSong,
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
        elem.liked = !elem.liked; //result.data.liked;
        elem.likes = result.data.likes;
        let newArr = [...postList.slice(0, objIndex), elem, ...postList.slice(objIndex+1)];
        console.log(newArr)
        setPosts(newArr);
        console.log("elem inside: ");
        console.log(elem);
        // setPosts(newArr);
        // return;
      }
    })

    // let newArr = postList.map((elem) => {
    //   if (elem._id === id) {
    //     makeLikeCall(id, elem.liked).then( result => {
    //       if (result && result.status === 201) {
    //         elem.liked = !elem.liked; //result.data.liked;
    //         elem.likes = result.data.likes;
    //         console.log("elem inside: ");
    //         console.log(elem);
    //         // setPosts(newArr);
    //         // return;
    //       }
    //     })
    //   }
    //   console.log("elem outside: ");
    //   console.log(elem);
    //   return elem;
    // });
    // console.log("in update likes");
    // // console.log(newArr);
    // setPosts(newArr);
    // console.log("postList: ");
    // console.log(postList);
  }

  async function makeLikeCall(id, liked) {
    // console.log('inside makeLikeCall: ' + liked);
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
          {postList.map((post, index) => 
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
                song={post.title}
                artist={post.artist}
                timePosted={parseInt((new Date() - new Date(post.createdAt)) / 3600000)}
                likes={post.likes}
                liked={post.liked}
                url={post.url}
                updateLikes={(e) => {
                  updateLikes(post._id)
                }}
                album={post.album}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
