import { BiLike } from "react-icons/bi";
import { BsSpotify } from "react-icons/bs";
import album1 from '../../images/denim-jacket.png';
import './Post.css';
import 'reactjs-popup/dist/index.css';

function Post({song, artist, timePosted, likes, url}) {
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
        <button className='likes'><BiLike></BiLike>{likes}</button>
        <button className='spotify'><BsSpotify></BsSpotify>Play on Spotify</button>
      </div>
    </div> 
  )
}

export default Post;
