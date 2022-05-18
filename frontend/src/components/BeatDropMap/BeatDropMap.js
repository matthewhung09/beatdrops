import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "./BeatDropMap.css";

const musicnote = new Icon({
  iconUrl: "/musnoteMarker.png",
  iconSize: [75, 90],
});

function BeatDropMap({ lat, long, posts }) {
  const notes = new Map();
  for (let i = 0; i < posts.length; i++) {
    let rLat = Math.ceil(posts[i].location.lat / 0.00002) * 0.000002;
    let rLong = Math.ceil(posts[i].location.long / 0.00002) * 0.000002;
    let coordString = rLat.toString() + ", " + rLong.toString();
    if (notes.has(coordString)) {
      notes.get(coordString).push(posts[i]);
    } else {
      notes.set(coordString, [posts[i]]);
    }
  }
  for (let i = 0; i < posts.length; i++) {
    console.log("potato");
  }
  console.log(notes);
  notes.forEach((posts) => {
    console.log(posts.length);
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
      {/* {posts.map(
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
      )} */}
      {notes.forEach((posts) => {
        //posts[0].location.onCampus &&
        //posts.length > 1 ? (
        <Marker
          position={[posts[0].location.lat, posts[0].location.long]}
          icon={musicnote}
          //key={index}
        >
          <Popup>text</Popup>
        </Marker>;
        // ) : (
        //   <Marker
        //     position={[posts[0].location.lat, posts[0].location.long]}
        //     icon={musicnote}
        //     //key={index}
        //   >
        //     <Popup>
        //       {posts[0].title} <br /> something
        //     </Popup>
        //   </Marker>
        // );
      })}
    </MapContainer>
  );
}

export default BeatDropMap;
