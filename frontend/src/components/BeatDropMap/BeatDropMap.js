import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "./BeatDropMap.css";

const musicnote = new Icon({
  iconUrl: "/musnoteMarker.png",
  iconSize: [75, 90],
});

function BeatDropMap({ lat, long, posts }) {
  const grouped = new Map();
  for (let i = 0; i < posts.length; i++) {
    let rLat = Math.ceil(posts[i].location.lat / 0.00002) * 0.000002;
    let rLong = Math.ceil(posts[i].location.long / 0.00002) * 0.000002;
    let coordString = rLat.toString() + ", " + rLong.toString();
    if (grouped.has(coordString)) {
      grouped.get(coordString).push(posts[i]);
    } else {
      grouped.set(coordString, [posts[i]]);
    }
  }

  const notes = [];
  grouped.forEach((group) => {
    const newEntry = {};
    newEntry.location = group[0].location;
    if (group.length > 1) {
      newEntry.isMultiple = true;
      for (let i = 0; i < group.length; i++) {
        if ("posts" in newEntry) {
          newEntry.posts.push(group[i]);
        } else {
          newEntry.posts = [group[i]];
        }
      }
    } else {
      newEntry.posts = group[0];
    }
    notes.push(newEntry);
  });

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
      {notes.map(
        (marker, index) =>
          marker.location.onCampus &&
          (marker.isMultiple ? (
            <Marker
              position={[marker.location.lat, marker.location.long]}
              icon={musicnote}
              key={index}
            >
              <Popup>
                {marker.posts[0].title} <br /> {marker.posts[0].artist}
              </Popup>
            </Marker>
          ) : (
            <Marker
              position={[marker.location.lat, marker.location.long]}
              icon={musicnote}
              key={index}
            >
              <Popup>
                {marker.posts.title} <br /> {marker.posts.artist}
              </Popup>
            </Marker>
          ))
      )}
    </MapContainer>
  );
}

export default BeatDropMap;
