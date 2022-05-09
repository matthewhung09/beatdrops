import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Map.css";

let prefix = process.env.REACT_APP_URL_LOCAL;

const musicnote = new Icon({
  iconUrl: "/musicnote.png",
  iconSize: [25, 40],
});

function Map({ lat, long, posts }) {
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
        <Marker position={[marker.location.lat, marker.location.long]} icon={musicnote} key={index}>
          <Popup>
            {marker.title} <br /> {marker.artist}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Map;
