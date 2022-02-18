import { React, useState, useEffect } from "react";
import axios from 'axios';

function useAuth(code) {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState();

    useEffect(() => {
        axios.post('http://localhost:5000/auth/login', {code})
            .then(res => {
                setAccessToken(res.data.accessToken);
                setRefreshToken(res.data.refreshToken);
                setExpiresIn(res.data.expiresIn);
                // window.history.pushState({}, null, '/'); // clears the code from the url
            })
            .catch(() => {
                window.location = '/' // reroute them to login if expires
            })
    }, [code]);

    useEffect(() => {
        // make sure this doesn't run before we have a refresh token
        if (!refreshToken || !expiresIn) {
            return;
        }
        // axios.post('http://localhost:5000/auth/refresh', {refreshToken})
        // .then(res => {
        //     console.log(res);
        //     setAccessToken(res.data.accessToken);
        //     setExpiresIn(61);
        // })
        // .catch(() => {
        //     console.log(code);
        //     window.location = '/' 
        // });
        const interval = setInterval(() => {
            axios.post('http://localhost:5000/auth/refresh', {refreshToken})
                .then(res => {
                    console.log(res);
                    setAccessToken(res.data.accessToken);
                    setExpiresIn(res.data.expiresIn);
                })
                .catch(() => {
                    console.log(code);
                    window.location = '/' 
                });
        }, (expiresIn - 60 ) * 1000);
        return () => clearInterval(interval); // in case refresh token changes before refresh, clear timeout
    }, [refreshToken, expiresIn])

    return accessToken;
}

export default useAuth;