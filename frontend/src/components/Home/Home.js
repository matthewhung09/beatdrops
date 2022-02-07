import Post from '../Post/Post';
import './Home.css';

function Home({posts}) {
  return (
    <div className='home'>
        {posts.map((post) => 
            <Post 
                song={post.title}
                artist={post.artist}
                timePosted={post.timePosted}
                likes={post.likes}
                liked={post.liked}
                url={post.url}
                album={post.album}
            />
        )}
    </div>
  );
}

export default Home;
