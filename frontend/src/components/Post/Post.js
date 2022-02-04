import React from "react";
import { BiLike } from "react-icons/bi";
import { BsSpotify } from "react-icons/bs";
import album1 from '../../images/denim-jacket.png';
import './Post.css';
import 'reactjs-popup/dist/index.css';

function Post({song, artist, timePosted, likes, liked, url}) {
  const [isLiked, setLiked] = React.useState(liked);
  const [numLikes, setNumLikes] = React.useState(likes);

  function updateLikes() {
    JSON.parse(isLiked) === false 
      ? setNumLikes(numLikes+1)
      : setNumLikes(numLikes-1);
    setLiked(!isLiked)
  }

  // let likeStyle = {
  //   border: '1px solid black'
  // };
  // if(this.state.numLikes > liked) {
  //   likeStyle = {
  //     border:'1px solid blue',
  //     backgroundColor: '#dcf2ffcb',
  //   }
  // }  

  return (
    <div className='card'>
      <div className='left-wrapper'>
        <div className='image'>
          <img src={album1} alt='album1'/>
        </div>
        <div className='description'>
          <h2>{song}</h2>
          <h3>{artist}</h3>
          <p>Posted {timePosted} hours ago</p>
        </div>
      </div>
      <div className='action'>
        <button className='likes' onClick={updateLikes}> 
          <BiLike></BiLike>{numLikes}
        </button>
        <form action={url}>
          <button className='spotify' type="submit"><BsSpotify></BsSpotify>View on Spotify</button>
        </form>
      </div>
    </div> 
  )
}

export default Post;
