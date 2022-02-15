import { React, useState, useEffect } from "react";
import axios from 'axios';

function useAuth(code) {
    const [accessToken, setAccessToken] = useState()
    const [refeshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()

    useEffect(() => {
        axios.post('http://localhost:5000/auth/login', {code})
            .then(res => {
                console.log(res);
                setAccessToken(res.data.accessToken);
                setRefreshToken(res.data.refreshToken);
                setExpiresIn(res.data.expiresIn);
            })
            .catch(() => {
                window.location = '/' // reroute them to login if expires
            })
    }, [code]);

    return accessToken;
}

export default useAuth;