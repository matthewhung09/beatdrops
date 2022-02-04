import Post from '../Post/Post';
import './Home.css';

function Home({posts}) {
  return (
    <div className='home'>
        {posts.map((post) => 
            <Post 
                song={post.song}
                artist={post.artist}
                timePosted={post.timePosted}
                likes={post.likes}
                liked={post.liked}
                url={post.url}
            />
        )}
    </div>
  );
}

export default Home;
