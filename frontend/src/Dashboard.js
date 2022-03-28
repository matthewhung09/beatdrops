import {React, useEffect, useState} from 'react';
import axios from 'axios';

function Dashboard(props) {
    const accessToken = props.token;
    const [currentlyPlaying, setCurrentlyPlaying] = useState('');
    
    useEffect(() => {
        if (accessToken === '') {
            return;
        }
        axios.post('http://localhost:5000/current', {accessToken})
            .then(res => {
                if (res)
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