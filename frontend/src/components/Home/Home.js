import Post from '../Post/Post';
import './Home.css';

function Home(props) {
  return (
    <div className='home'>
        {props.posts.map((post) => 
            <Post
                song={post.song}
                artist={post.artist}
                timePosted={post.timePosted}
                likes={post.likes}
                url={post.url}
            />
        )}
    </div>
  );
}

export default Home;
