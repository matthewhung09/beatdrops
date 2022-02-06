import { React, useState, useEffect } from "react";
import Post from '../Post/Post';
import Dropdown from '../Dropdown/Dropdown';
import Modal from "../Modal/Modal";
import './Home.css';

function Home({newSong, newArtist, onClick, onChangeSong, onChangeArtist, posts}) {
  const [selected, setSelected] = useState('Filter');
  const [filtered, setFilter] = useState(posts);

  useEffect(() => {
    if (selected === 'Likes') {
      setFilter([...posts].sort((a, b) => a.likes - b.likes));
      console.log(filtered);
    }
    else if (selected === 'Recent') {
      setFilter([...posts].sort((a, b) => a.timePosted - b.timePosted));
    }
    // console.log(filtered);
  }, [selected]);

  return (
    <div className='home'>
      <div className='home-actions'>
        {/* ----- filter menu -----  */}
        <Dropdown selected={selected} setSelected={setSelected}/>
        {/* ----- create a new post popup -----  */}
        <Modal
          newSong={newSong}
          newArtist={newArtist}
          onClick={onClick}
          onChangeSong={onChangeSong}
          onChangeArtist={onChangeArtist}
        />
      </div>
      {filtered.map((post) => 
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
