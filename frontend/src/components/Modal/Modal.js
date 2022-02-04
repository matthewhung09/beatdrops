import React from "react";
import Popup from 'reactjs-popup';
import PostForm from "../PostForm/PostForm";
import './Modal.css';

function Modal({newSong, newArtist, onClick, onChangeSong, onChangeArtist}) {
    <Popup
        trigger={<button className="button"> Open Modal </button>}
        modal
        nested
      >
        {close => (
          <div className="modal">
            <button className="close" onClick={close}>
              &times;
            </button>
            <div className="header"> Modal Title </div>
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
}

export default Modal;
