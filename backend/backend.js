const express = require('express');
const res = require('express/lib/response');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');
const qs = require('qs');
const cors = require('cors');
const app = express();
const port = 5000;

dotenv.config({path: path.resolve(__dirname, '.env')})

const client_id = process.env.CLIENT_ID; 
const client_secret = process.env.CLIENT_SECRET; 
const auth_token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64');

app.use(cors());
app.use(express.json());

// const posts = {
//     post_list:
//     [
//         {
//             'song': 'Denim Jacket',
//             'artist': 'Sammy Rae & The Friends',
//             'timePosted': 19,
//             'likes': 5,
//             'url': 'google.com'
//         },
//     ]
// }

app.listen(port, () => {
    console.log('Listening on 5000');
});

app.get('/', (req, res) => {
    res.send('Hello, World');
});

// app.get('/login', () => {
//     res.redirect('https://accounts.spotify.com/authorize?' +
    
// });

app.post('/create', async (req, res) => {
    // console.log(req.body);
    const song_title = req.body.song;
    const artist = req.body.artist;

    // console.log(song_title);
    // console.log(artist);

    const data = {
        'type': 'track',
        'limit': '10'
    }
    // Format querystring - should probably find a better way to do this
    const first_part = 'q=track:' + song_title.replaceAll(' ', '%20') + '%20artist:' + artist.replaceAll(' ', '%20');
    const second_part = new URLSearchParams(data).toString();
    const queryparam = first_part + '&' + second_part;

    const access_token = await(getAccessToken());

    // console.log(queryparam);
    try {
        const response = await axios.get('https://api.spotify.com/v1/search?' + queryparam, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        const song_url = response.data.tracks.items[0].external_urls.spotify;
        
        // Get actual song name and artist in case of mispellings/typos
        // console.log(response.data.tracks.items[0].name); 
        // console.log(response.data.tracks.items[0].artists[0].name);

        return res.status(201).send(song_url);
    }
    catch(error) {
        console.log(error);
    }

});

async function getAccessToken() {
    try {
        const data = qs.stringify({'grant_type':'client_credentials'});
        const response = await axios.post('https://accounts.spotify.com/api/token', data, {
            headers: {
                'Authorization': `Basic ${auth_token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        // console.log(response.data.access_token);
        return response.data.access_token;
    }
    catch(error) {
        console.log(error);
    }
}  
