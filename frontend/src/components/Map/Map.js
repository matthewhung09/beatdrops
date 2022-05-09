import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

let prefix = process.env.REACT_APP_URL_LOCAL;

const musicnote = new Icon({
  iconUrl: "/musicnote.png",
  iconSize: [25, 40],
});

function getPostLocations(posts) {
  let locs = [];
  for (let i = 0; i < posts.length; i++) {
    locs.push([posts[0].location.lat, posts[0].location.long]);
  }
  return locs;
}

function Map({ lat, long }) {
  console.log("lat: " + lat + ", long: " + long);
  const [postList, setPosts] = useState([]);
  const markers = [
    [35.29998594, -120.662194],
    [35.30190423, -120.6637702],
    [35.30049726, -120.6635648],
    [35.30020077, -120.6588906],
    [35.30246159, -120.6641323],
    [35.2993642, -120.6558726],
  ]; //Where to set markers

  const position = [35.30190423, -120.6637702]; //Position at Cal Poly Slo

  useEffect(() => {
    const url = `${prefix}/posts?lat=${lat}&long=${long}`;
    axios
      .get(url, { withCredentials: true })
      .then((response) => {
        setPosts(response.data.posts);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {postList.map((marker, index) => (
        <Marker position={[marker.location.lat, marker.location.long]} icon={musicnote} key={index}>
          <Popup>
            Beat <br /> Dropped!
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Map;
