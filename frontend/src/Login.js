import React from 'react';

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=8f94ae5d9a62410c806299d38836db1a&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

function Login() {
    return (
        <div className="login-button">
            <a href={AUTH_URL}>
                LOGIN WITH SPOTIFY
            </a>
        </div>
    );
}

export default Login;