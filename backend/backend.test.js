const axios = require("axios")

const userPlaylists = require("./backend-services")

const currSongData = require('./currentSongData.json');


jest.mock('axios'); 

test('fetch current song', () => {

    //Get the test json data
    const mockCurrentPlayingSong = currSongData;
    
    const resp = {data: mockCurrentPlayingSong};

    axios.get.mockResolvedValue(resp);
 
    userPlaylists.getCurrentSong().then(data => expect(data).toEqual(mockCurrentPlayingSong))
    .catch(error => console.log(error));
    
});



test("fetch playlists", () => {
  
  const mockPlaylists = [
    {
      name: "Playlist #1",
      id: "7HSBDKNSLJD8dsfhiuvdfkh8w34WpO",
      tracks: [
        {
          artist: "Anderson .Paak",
          title: "Fire in the Sky",
        },
      ],
    },

    {
      name: "Playlist #2",
      id: "2OSKFHWLENF3yulkpfhunsg5w96Po5",
      tracks: [
        {
          artist: "Frank Ocean",
          title: "Pink + White",
        },
      ],
    },
  ]

  const resp = { data: mockPlaylists }

  axios.get.mockResolvedValue(resp)

  // axios.get.mockImplementation( () => Promise.resolve(resp));

  userPlaylists
    .getPlaylists()
    .then((data) => expect(data).toEqual(mockPlaylists))
    .catch((error) => console.log(error))
})
