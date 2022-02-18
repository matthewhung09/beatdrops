import React from 'react';

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=31aab7d48ba247f2b055c23b5ac155d8&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

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