import {React, useEffect, useState} from 'react';
import SpotifyWebPlayer from 'react-spotify-web-playback';
import SpotifyPlayer from 'react-spotify-web-playback';
import useAuth from '../../useAuth';

function WebPlayer({code, trackUri}) {
    const accessToken = useAuth(code);
    const [play, setPlay] = useState(false)

    useEffect(() => {
        setPlay(true)
    }, [trackUri]);

    if (!accessToken) {
        return null;
    }
    return (
        <SpotifyPlayer 
            token={accessToken}
            showSaveIcon
            callback={state => {
                if (!state.isPlaying) setPlay(false)
            }}
            play={play}
            uris={trackUri ? [trackUri] : []}
        />
    )
}

export default WebPlayer;