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
import { BsGoogle } from 'react-icons/bs';

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

  const [json_string, setPlace] = useState();

  function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = lat1/180 * Math.PI
    var radlat2 = lat2/180 * Math.PI
    var theta = lon1-lon2
    var radtheta = theta/180 * Math.PI
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    
    if (dist > 1) {
      
      dist = 1;
   
    }
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
  }

  var data = [
  {
    "lat": "35.3019042345141",
    "lng": "-120.663770199052",
    "location": "Kennedy Library"
  }, 

  {
    "lat": "35.3045929951656",
    "lng": "-120.65713551467",
    "location": "Cerro Vista"
  }, 
  
  {
    "lat": "35.3076795759995",
    "lng": "-120.658660456386",
    "location": "Poly Canyon Village"
  },

  {
    "lat": "35.2999859354705",
    "lng": "-120.662193990845",
    "location": "Frank E. Pilling"
  },

  {
    "lat": "35.3004972596904",
    "lng": "-120.663564762495",
    "location": "Dexter Lawn"
  },

  {
    "lat": "35.2983779910806",
    "lng": "-120.660351213604",
    "location": "Recreation Center"
  },

  {
    "lat": "35.3002007707587",
    "lng": "-120.658890559142",
    "location": "University Union"
  },
/**** 
  {    
    "lat": "35.2987650638619",
    "lng": "-120.658818689553",
    "location": "Robert A. Mott Athletics Center"
  },

  {    
    "lat": "35.3003781803328",
    "lng": "-120.661651050362",
    "location": "Engineering East"
  },

  {    
    "lat": "35.3002527017527",
    "lng": "-120.663017848904",
    "location": "Engineering West"
  },
/**** 
  {    
    "lat": "35.2991973029906",
    "lng": "-120.660711514624",
    "location": "Engineering South"
  },

  {    
    "lat": "35.302586938337",
    "lng": "-120.665796716964",
    "location": "Grant M. Brown Engineering"
  },

  {    
    "lat": "35.3026023229155",
    "lng": "-120.665196290965",
    "location": "Engineering IV"
  },


  {    
    "lat": "35.3024615931535",
    "lng": "-120.664132257375",
    "location": "Bonderson Engineering Project Center"
  },

  {    
    "lat": "35.298930764896",
    "lng": "-120.654741888872",
    "location": "Sierra Madre & Yosemite Halls"
  },

  {    
    "lat": "35.2971328936685",
    "lng": "-120.654362182796",
    "location": "yakʔityutyu"
  },

  {    
    "lat": "35.2999834096232",
    "lng": "-120.656531982463",
    "location": "South Mountain Halls"
  },

  {    
    "lat": "35.3023868534931",
    "lng": "-120.657990211641",
    "location": "North Mountain Halls"
  },

  {    
    "lat": "35.2993641954382",
    "lng": "-120.655872642195",
    "location": "Vista Grande"
  },
/**** 
  {    
    "lat": "35.2997316775223",
    "lng": "-120.657821949234",
    "location": "Performing Arts Center"
  },

  {    
    "lat": "35.2998121600388",
    "lng": "-120.665688809274",
    "location": "O'Neill Green"
  },

  {    
    "lat": "35.2992102945687",
    "lng": "-120.662748515282",
    "location": "Construction Innovations Center"
  },

  {    
    "lat": "35.3007469108853",
    "lng": "-120.664238013474",
    "location": "Architecture and Environmental Design"
  },
 
  {    
    "lat": "35.3009499632774",
    "lng": "-120.659865559672",
    "location": "Centennial Lawn"
  },

  {    
    "lat": "35.3013598301738",
    "lng": "-120.660486565642",
    "location": "Baker Science"
  },

  {    
    "lat": "35.3009078410168",
    "lng": "-120.658545274019",
    "location": "Administration"
  },

  {    
    "lat": "35.3027707521127",
    "lng": "-120.6629426385",
    "location": "Agricultural Science"
  },

  {    
    "lat": "35.3035560965283",
    "lng": "-120.662916128092",
    "location": "Campus Market"
  },

  {    
    "lat": "35.3021713890058",
    "lng": "-120.659275444297",
    "location": "Clyde P. Fisher Science"
  },

  {    
    "lat": "35.3003930376424",
    "lng": "-120.664487583688",
    "location": "Cotchett Education Building"
  },

  {    
    "lat": "35.3021952553351",
    "lng": "-120.66508149649",
    "location": "Advance Technology Laboratories"
  },

  {    
    "lat": "35.299181512437",
    "lng": "-120.661760184554",
    "location": "Graphic Arts"
  },
/*** 
  {    
    "lat": "35.2996041782305",
    "lng": "-120.659717751913",
    "location": "Dining Complex"
  },

  {    
    "lat": "35.3019691618594",
    "lng": "-120.661477374356",
    "location": "Alan A. Erhart Agriculture"
  },
/*** 
  {    
    "lat": "35.2979314241168",
    "lng": "-120.653542430721",
    "location": "Yosemite Residence Halls"
  }
**/
  ];

  
  useEffect(() => {
    const handleLocation = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
         console.log(`${lat}, ${long}`);

         for (var i = 0; i < data.length; i++) {
          // if this location is within 0.1KM of the user, add it to the list
          if (distance(lat, long, data[i].lat, data[i].lng, "K") <= 0.1) {
             
              console.log(data[i].location);

             // json_string = JSON.stringify(data[i].location);
             setPlace(data[i].location);
          
          }
      }

         //console.log(long);
      });
    };

    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
      //  if (result.state === 'granted') {
        //  console.log(result.state);
         // handleLocation();

         if (result.state !== 'denied') {
          console.log(result.state);
          handleLocation();
        } 

         else if (result.state === 'prompt') {
          console.log('prompt');
        } else if (result.state === 'denied') {
          console.log('Denied');
        }
      });
    }
  }, [lat, long]);

  //function to get location name


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
                      //location={`${lat}, ${long}`}
                      location = {`${json_string}`}
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
