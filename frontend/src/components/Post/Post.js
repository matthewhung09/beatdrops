import { BiLike } from "react-icons/bi";
import { BsSpotify } from "react-icons/bs";
import './Post.css';
import 'reactjs-popup/dist/index.css';
import Spotify from 'react-spotify-embed'; // https://www.npmjs.com/package/react-spotify-embed

function Post({song, artist, timePosted, likes, liked, url, updateLikes, album}) {
	return (
		<div className='card'>
			<Spotify wide link={url}/>

			{/* <div className='left-wrapper'>
				<div className='image'>
					<img style={{height: '100px', width: '100px'}} src={album} alt='album'/>
				</div>
				<div className='description'>
					<h2>{song}</h2>
					<h3>{artist}</h3>
					
				</div>
			</div> */}
			<div className='action'>
				{liked === false ? (
					<button className='likes' onClick={updateLikes} style={{border: '1px solid black', color: 'black', backgroundColor: 'transparent'}}> 
						<BiLike/>{likes}
					</button>
				) : (
					<button className='likes' onClick={updateLikes} style={{border:'1px solid #0065B8', color: '#0065B8', backgroundColor: '#DCEFFE'}}> 
						<BiLike/>{likes}
					</button>
				)}
				{timePosted < 1 ? <p>Posted less than an hour ago</p>
						: timePosted === 1 ? <p>Posted an hour ago</p>
					 	: <p>Posted {timePosted} hours ago</p>
					}
				{/* <button onClick={() => {window.open(url, "_blank")}} className='spotify' type="submit">
					<BsSpotify/>View on Spotify
				</button>
				<button onClick={playTrack} style={{border:'1px solid #0065B8', color: '#0065B8', backgroundColor: '#DCEFFE'}} className='play' type="submit">
					Play
				</button> */}
			</div>
		</div> 
	);
}

export default Post;
