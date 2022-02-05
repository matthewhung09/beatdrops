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
		JSON.parse(isLiked) === false ? (
			setNumLikes(numLikes+1)
		) : (
			setNumLikes(numLikes-1)
		)
		setLiked(!isLiked)
	}

	let likeStyle;
	isLiked === false ? (
		likeStyle = { border:'1px solid black', color: 'black', backgroundColor: 'transparent' }
	) : (
		likeStyle = { border:'1px solid #0065B8', color: '#0065B8', backgroundColor: '#DCEFFE' }
	);

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
		<button className='likes' onClick={updateLikes} style={likeStyle}> 
			<BiLike></BiLike>{numLikes}
		</button>
        <button onClick={() => {window.open(url, "_blank")}} className='spotify' type="submit">
          <BsSpotify></BsSpotify>View on Spotify
        </button>
      </div>
    </div> 
  )
}

export default Post;
