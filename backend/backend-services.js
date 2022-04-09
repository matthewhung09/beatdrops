const axios = require("axios");
const baseURI = "https://api.spotify.com/v1";
  
async function getPlaylists(accessToken) {

    let response = await axios.get(`${baseURI}/me/playlists`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });

        let playlists = [];
        for (let i = 0; i < response.data.items.length; i++) {
            playlists.push({
                name: response.data.items[i].name,
                id: response.data.items[i].id,
                tracks: await getTracks(response.data.items[i].id, accessToken),
            });
        }

        result = playlists.filter((playlist) => playlist.tracks.length > 0);
        
        return result;


}

async function getTracks(id, token) {

        let response = await axios.get(`${baseURI}/playlists/${id}/tracks`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        let tracks = [];
        for (let i = 0; i < response.data.items.length; i++) {
            tracks.push({
                artist: response.data.items[i].track.artists[0].name,
                title: response.data.items[i].track.name,
            });
        }

        return tracks;
}

module.exports = { getPlaylists };

