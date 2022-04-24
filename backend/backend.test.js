const axios = require("axios");

const userPlaylists = require("./backend-services");
jest.mock("axios");
const currSongData = require("./currentSongData.json");

jest.mock("axios");

beforeEach(async () => {
  jest.clearAllMocks();
});

test("Get access token -- success", async () => {
  //Get the test json data
  const mockAccessToken =
    "AQA9fhv_Z3aaSHGXZ4YtPvb5VbdzXNuYGYFP2--x0uaQI710kFmK7Uxb2rG1X0qMzL9o_JmwHMZGQii7g_x8VOZZHskKH50crghi5daTZq8zXB2IzBNeE2QDxJRvyucwpKg";

  const resp = {
    data: {
      access_token: mockAccessToken,
    },
  };

  axios.post.mockResolvedValue(resp);

  const res = await userPlaylists.getAccessToken();
  expect(res).toEqual(mockAccessToken);
});

test("Get access token -- failure", async () => {
  axios.post.mockResolvedValue(undefined);
  const res = await userPlaylists.getAccessToken();
  expect(res).toBe(undefined);
});

test("Get song data -- success", async () => {
  //Get the test json data
  const mockSong = {
    tracks: {
      items: [
        {
          name: "Dean Town",
          id: "7HSBDKNSLJD8dsfhiuvdfkh8w34WpO",
          uri: "spotify:track:1oOD1pV43cV9sHg97aBdLs",
          external_urls: {
            spotify: "https://open.spotify.com/track/1oOD1pV43cV9sHg97aBdLs",
          },
          artists: [
            {
              name: "Vulfpeck",
            },
          ],
        },
      ],
    },
  };

  const new_post = {
    title: "Dean Town",
    artist: "Vulfpeck",
    likes: 0,
    reposts: 0,
    //lastPosted: new Date(),
    url: "https://open.spotify.com/track/1oOD1pV43cV9sHg97aBdLs",
    location: undefined,
    spotify_id: "7HSBDKNSLJD8dsfhiuvdfkh8w34WpO",
    spotify_uri: "spotify:track:1oOD1pV43cV9sHg97aBdLs",
  };

  const resp = {
    data: mockSong,
  };
  axios.get.mockResolvedValue(resp);

  const mockAccessToken =
    "AQA9fhv_Z3aaSHGXZ4YtPvb5VbdzXNuYGYFP2--x0uaQI710kFmK7Uxb2rG1X0qMzL9o_JmwHMZGQii7g_x8VOZZHskKH50crghi5daTZq8zXB2IzBNeE2QDxJRvyucwpKg";

  const respo = {
    data: {
      access_token: mockAccessToken,
    },
  };
  axios.post.mockResolvedValue(respo);

  const res = await userPlaylists.getPostData("Dean Town", "Vulfpeck", undefined);
  expect(res).toEqual(new_post);
});

test("Get song data -- failure", async () => {
  const mockAccessToken =
    "AQA9fhv_Z3aaSHGXZ4YtPvb5VbdzXNuYGYFP2--x0uaQI710kFmK7Uxb2rG1X0qMzL9o_JmwHMZGQii7g_x8VOZZHskKH50crghi5daTZq8zXB2IzBNeE2QDxJRvyucwpKg";

  const respo = {
    data: {
      access_token: mockAccessToken,
    },
  };
  axios.post.mockResolvedValue(respo);

  axios.get.mockResolvedValue(false);
  const res = await userPlaylists.getPostData("Dean Town", "Vulfpeck", undefined);
  expect(res).toBe(false);
});

test("Get song data -- no song matches", async () => {
  const mockSong = {
    tracks: {
      items: [],
    },
  };
  const resp = {
    data: mockSong,
  };
  axios.get.mockResolvedValue(resp);

  const mockAccessToken =
    "AQA9fhv_Z3aaSHGXZ4YtPvb5VbdzXNuYGYFP2--x0uaQI710kFmK7Uxb2rG1X0qMzL9o_JmwHMZGQii7g_x8VOZZHskKH50crghi5daTZq8zXB2IzBNeE2QDxJRvyucwpKg";

  const respo = {
    data: {
      access_token: mockAccessToken,
    },
  };

  axios.post.mockResolvedValue(respo);
  const res = await userPlaylists.getPostData("not a real song", "aaaaaaa", undefined);
  expect(res).toBe(false);
});

// test("fetch current song", () => {
//   //Get the test json data
//   const mockCurrentPlayingSong = currSongData;

//   const resp = { data: mockCurrentPlayingSong };

//   axios.get.mockResolvedValue(resp);

//   userPlaylists
//     .getCurrentSong()
//     .then((data) => expect(data).toEqual(mockCurrentPlayingSong))
//     .catch((error) => console.log(error));
// });

test("fetch playlists", async () => {
  const mockPlaylists = {
    data: {
      items: [
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
      ],
    },
  };

  const resp = mockPlaylists;

  axios.get.mockResolvedValue(resp);

  // axios.get.mockImplementation( () => Promise.resolve(resp));

  const playlists = await userPlaylists.getPlaylists();
  expect(playlists.toEqual(mockPlaylists)).catch((error) => console.log(error));
});
