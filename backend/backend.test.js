const axios = require("axios");
const jsonwebtoken = require("jsonwebtoken");

const userPlaylists = require("./backend-services");
const currSongData = require("./currentSongData.json");
jest.mock("axios");
jest.mock("jsonwebtoken");

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

test("create jwt token", async () => {
  const randomToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMWZmNTA3NjcxMGUyOWM4ZTY2M2NmYiIsImlhdCI6MTY1MDk0NDEwNiwiZXhwIjoxNjUwOTQ3NzA2fQ.DfmfNdlU7K_Ke1rsbz-Cq5PsBc5emgspLyklLpD0hHg";
  jsonwebtoken.sign.mockResolvedValue(randomToken);
  const res = await userPlaylists.createToken("asdfa");
  expect(res).toEqual(randomToken);
});

test("fetch playlists", async () => {
  const mockPlaylists = {
    data: {
      items: [
        {
          name: "Playlist #1",
          id: "7HSBDKNSLJD8dsfhiuvdfkh8w34WpO",
          tracks: [
            {
              artist: [
                {
                  name: "Anderson .Paak",
                },
              ],
              title: "Fire in the Sky",
            },
          ],
        },
        {
          name: "Playlist #2",
          id: "2OSKFHWLENF3yulkpfhunsg5w96Po5",
          tracks: [
            {
              artist: [
                {
                  name: "Frank Ocean",
                },
              ],
              title: "Pink + White",
            },
          ],
        },
      ],
    },
  };

  const tracks = [
    {
      track: {
        artists: [
          {
            name: "Anderson .Paak",
          },
        ],
        title: "Fire in the Sky",
        playlistName: "Playlist #1",
      },
    },
    {
      track: {
        artists: [
          {
            name: "Frank Ocean",
          },
        ],
        title: "Pink + White",
        playlistName: "Playlist #2",
      },
    },
  ];

  axios.get.mockImplementation((url) => {
    switch (url) {
      case "https://api.spotify.com/v1/me/playlists":
        return mockPlaylists;
      default:
        return { data: { items: tracks } };
    }
  });

  const expected = [
    {
      id: "7HSBDKNSLJD8dsfhiuvdfkh8w34WpO",
      name: "Playlist #1",
      tracks: [
        { artist: "Anderson .Paak", playlistName: "Playlist #1", title: undefined },
        { artist: "Frank Ocean", playlistName: "Playlist #1", title: undefined },
      ],
    },
    {
      id: "2OSKFHWLENF3yulkpfhunsg5w96Po5",
      name: "Playlist #2",
      tracks: [
        { artist: "Anderson .Paak", playlistName: "Playlist #2", title: undefined },
        { artist: "Frank Ocean", playlistName: "Playlist #2", title: undefined },
      ],
    },
  ];

  const playlists = await userPlaylists.getPlaylists();
  expect(playlists).toEqual(expected);
});
