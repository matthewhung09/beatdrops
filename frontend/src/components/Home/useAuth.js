import { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    // if(!code){
    //   setRefreshToken(rToken);
    //   return;
    // }
    axios
      .post(`${process.env.REACT_APP_URL}/auth/callback`, {
        auth_code: code,
      })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
        window.history.pushState({}, null, "/home");
      })
      .catch((error) => {
        console.log(error);
        //window.location = "/spotify"
      });
  }, [code]);

  useEffect(() => {
    console.log("refresh effect");
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      axios
        .post(`${process.env.REACT_APP_URL}/auth/refresh`, {
          refreshToken,
        })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
        })
        .catch((error) => {
          console.log(error);
          //window.location = "/spotify"
        });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
