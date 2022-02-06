import React from "react";
import Popup from 'reactjs-popup';
import PostForm from "../PostForm/PostForm";
import { IoIosAddCircle } from "react-icons/io";
import './Modal.css';

function Modal({newSong, newArtist, onClick, onChangeSong, onChangeArtist}) {
  return (
    <Popup
      trigger={<button className="create-btn"> Create a new post <IoIosAddCircle/></button>}
      modal
      nested
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
                onClick={onClick}
                onChangeSong={onChangeSong}
                onChangeArtist={onChangeArtist}
              />
          </div>
        </div>
      )}
    </Popup>
  );
}

export default Modal;
