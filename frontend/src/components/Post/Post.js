import { BiLike } from "react-icons/bi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import './Post.css';
import 'reactjs-popup/dist/index.css';
import Spotify from 'react-spotify-embed'; 

function Post({song, artist, timePosted, likes, liked, url, updateLikes, album, location}) {
	// const location = "Kennedy Library";
	// const timeAndLocation1 = `Posted less than an hour ago @ ${location}`
	// const timeAndLocation2 = `Posted an hour ago @ ${location}`
	// const timeAndLocation3 = `Posted ${timePosted} hours ago @ ${location}`
	const view = 'coverart';
	const theme = 'black';
	return (
		<div className='card'>
			<div className='spotify-div'>
				<Spotify theme={theme} view={view} wide allowtransparency="false" link={url}/>
			</div>
			<div className='action'>
				{timePosted < 1 ? <p className="time"> <span>Posted less than</span> an hour ago at <b className="location">{location}</b> </p>
					: timePosted < 2 ? <p className="time"> <span>Posted an hour ago</span> at <b className="location"> {location}</b> </p>
					: <p className="time"> <span>Posted {timePosted} hours</span> ago at <b className="location"> {location}</b> </p>
				}
				{liked === false ? (
					<button className='likes' onClick={updateLikes} style={{color: 'black', backgroundColor: 'rgb(236, 236, 236)'}}> 
						<FaRegHeart/>{likes}
					</button>
				) : (
					<button className='likes' onClick={updateLikes} style={{color: '#0065B8', backgroundColor: '#DCEFFE'}}> 
						<FaHeart/>{likes}
					</button>
				)}
			</div>
		</div> 
	);
}

export default Post;
