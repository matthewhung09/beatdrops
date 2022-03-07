import {React, useEffect, useState} from 'react';
import useAuth from './useAuth';
import axios from 'axios';

function Dashboard(props) {
    const accessToken = props.code;
    const [currentlyPlaying, setCurrentlyPlaying] = useState('');
    
    console.log(accessToken);
    useEffect(() => {
        console.log('getting currently playing song');
        if (accessToken === '') {
            return;
        }
        console.log(accessToken);
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