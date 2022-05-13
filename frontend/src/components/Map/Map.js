import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "./Map.css";
import Post from "../Post/Post";

const musicnote = new Icon({
  iconUrl: "/musnoteMarker.png",
  iconSize: [75, 90],
});

function Map({ lat, long, posts, user}) {
  console.log("lat: " + lat + ", long: " + long);

  return (
    <MapContainer
      className="map"
      center={[lat, long]}
      zoom={17}
      scrollWheelZoom={true}
      // style={{ maxWidth: 500, zIndex: -10 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // style={{ maxWidth: 10 }}
      />
      {posts.map((marker, index) => (
        <Marker position={[marker.location.lat, marker.location.long]} icon={musicnote} key={index} 
       >
          <Popup>
          {marker.title} <br /> {marker.artist}
          <div className="posts">
            <Post
            
              uri={marker.spotify_uri}
              url={marker.url}
             
              spotifyId={marker.spotify_id}
           
            />
        </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Map;
