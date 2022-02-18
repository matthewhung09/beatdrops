import {React, useEffect, useState} from 'react';
import useAuth from './useAuth';
import axios from 'axios';

function Dashboard({code}) {
    const accessToken = useAuth(code);
    const [currentlyPlaying, setCurrentlyPlaying] = useState('');

    useEffect(() => {
        // console.log('getting currently playing song');
        if (!accessToken) {
            return;
        }
        axios.post('http://localhost:5000/current', {accessToken})
            .then(res => {
                setCurrentlyPlaying(res.data.song);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [accessToken] );

    return (
        <div>
            {/* {code} */}
            Currently playing song: {currentlyPlaying}
        </div>
    )
}


export default Dashboard;