const express = require('express');
const res = require('express/lib/response');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');
const qs = require('qs');

const app = express();
const port = 5000;

dotenv.config({path: path.resolve(__dirname, '.env')})

const client_id = process.env.CLIENT_ID; 
const client_secret = process.env.CLIENT_SECRET; 
const auth_token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64');

app.use(express.json());

app.listen(port, () => {
    console.log('Listening on 5000');
});

app.get('/', (req, res) => {
    res.send('Hello, World');
});

// app.get('/login', () => {
//     res.redirect('https://accounts.spotify.com/authorize?' +
    
// });

app.get('/test', async (req, res) => {
    // console.log('/test call');
    let access_token;
    try {
        const data = qs.stringify({'grant_type':'client_credentials'});
        const response = await axios.post('https://accounts.spotify.com/api/token', data, {
            headers: {
                'Authorization': `Basic ${auth_token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        // console.log(response.data.access_token);
        access_token = response.data.access_token;
    }
    catch(error) {
        console.log(error);
    }
    const queryparam = "q=track:pyramids%20artist:frank%20ocean&type=track&market=US&limit=10";

    try {
        const asdf = await axios.get('https://api.spotify.com/v1/search?' + queryparam, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        const song_url = asdf.data.tracks.items[0].external_urls.spotify;
        console.log(song_url);
    }
    catch(error) {
        console.log(error);
    }
});    
