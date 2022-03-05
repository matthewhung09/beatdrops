import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./Post.css";
import "reactjs-popup/dist/index.css";
import Spotify from "react-spotify-embed";

function Post({ timePosted, likes, liked, url, updateLikes, location }) {
    // first part of location message based on post time
    let message = "";
    if (timePosted < 1) {
        message = `Streamed less than an hour ago at`;
    } else if (timePosted < 2) {
        message = `Streamed an hour ago at`;
    } else if (timePosted < 24) {
        message = `Streamed ${timePosted} hours ago at`;
    } else if (timePosted < 25) {
        message = `Streamed a day ago at`;
    } else {
        message = `Streamed ${parseInt(timePosted / 24)} days ago at`;
    }

    // strip number from campus buildings
    if (location.includes("(")) {
        location = location.substring(0, location.indexOf("("));
    }

    return (
        <div className="card">
            <div className="spotify-div">
                <Spotify wide allowtransparency="false" link={url} />
            </div>
            <div className="action">
                <p className="time">
                    {message}
                    <b className="location">{` ${location}`}</b>
                </p>
                {liked === false ? (
                    <button
                        className="likes"
                        onClick={updateLikes}
                        style={{ color: "black", backgroundColor: "rgb(236, 236, 236)" }}
                    >
                        <FaRegHeart />
                        {likes}
                    </button>
                ) : (
                    <button
                        className="likes"
                        onClick={updateLikes}
                        style={{ color: "#0065B8", backgroundColor: "#DCEFFE" }}
                    >
                        <FaHeart />
                        {likes}
                    </button>
                )}
            </div>
        </div>
    );
}

export default Post;
