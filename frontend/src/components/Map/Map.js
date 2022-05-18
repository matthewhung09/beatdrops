import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "./Map.css";

const musicnote = new Icon({
  iconUrl: "/musnoteMarker.png",
  iconSize: [75, 90],
});

//groups near post
//returns a hashmap ([lat, long], [songs])
function groupPosts(posts) {
  let notes = new Map();
  for (let i = 0; i < posts.length; i++) {
    console.log(posts[i]);
    let rLat = Math.ceil(posts[i].location.lat / 0.00002) * 0.000002;
    let rLong = Math.ceil(posts[i].location.long / 0.00002) * 0.000002;
    if (notes.has([rLat, rLong])) {
      //let songs = notes.get([rLat, rLong]).push({ title: posts[i].title, artist: posts[i].artist });
      notes.set([rLat, rLong], [{ title: posts[i].title, artist: posts[i].artist }]);
    } else {
      notes.set([rLat, rLong], [{ title: posts[i].title, artist: posts[i].artist }]);
    }
  }
  return notes;
}

function Map({ lat, long, posts }) {
  //const notes = groupPosts(posts);
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
      {posts.map(
        (marker, index) =>
          marker.location.onCampus && (
            <Marker
              position={[marker.location.lat, marker.location.long]}
              icon={musicnote}
              key={index}
            >
              <Popup>
                {marker.title} <br /> {marker.artist}
              </Popup>
            </Marker>
          )
      )}
    </MapContainer>
  );
}

export default Map;
