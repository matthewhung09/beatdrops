import React from 'react';
import SpotifyPlayer from 'react-spotify-web-playback';
import useAuth from '../../useAuth';

function WebPlayer({code, trackUri}) {
    const accessToken = useAuth(code);

    console.log(accessToken);
    if (!accessToken) {
        return null;
    }
    return (
        <SpotifyPlayer 
            token={accessToken}
            showSaveIcon
            uris={trackUri ? [trackUri] : []}
        />
    )
}

export default WebPlayer;