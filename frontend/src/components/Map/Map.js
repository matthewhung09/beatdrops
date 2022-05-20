import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "./Map.css";

const musicnote = new Icon({
  iconUrl: "/musnoteMarker.png",
  iconSize: [75, 90],
});

function Map({ lat, long, posts }) {
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
