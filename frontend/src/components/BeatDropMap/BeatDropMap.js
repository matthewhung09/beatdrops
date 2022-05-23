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
    let rLat = Math.ceil(posts[i].location.lat / 0.00005) * 0.000005;
    let rLong = Math.ceil(posts[i].location.long / 0.00005) * 0.000005;
    let coordString = rLat.toString() + ", " + rLong.toString();
    if (grouped.has(coordString)) {
      grouped.get(coordString).push(posts[i]);
    } else {
      grouped.set(coordString, [posts[i]]);
    }
  }

  const notes = Array.from(grouped.values());
  console.log(notes);

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
          marker[0].location.onCampus && (
            <Marker
              position={[marker[0].location.lat, marker[0].location.long]}
              icon={musicnote}
              key={index}
            >
              <Popup>
                <ol>
                  {marker.map((post) => (
                    <li>
                      {" "}
                      {post.title} <br /> {post.artist}{" "}
                    </li>
                  ))}
                </ol>
              </Popup>
            </Marker>
          )
      )}
    </MapContainer>
  );
}

export default BeatDropMap;
