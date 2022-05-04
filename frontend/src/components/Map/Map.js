import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import {Icon} from "leaflet";


const musicnote = new Icon({
  iconUrl: '/musicnote.png',
  iconSize: [25,40]
});

function Map() {

  const markers = [35.29998594, -120.662194]; //Where to set markers
  const position = [35.30190423, -120.6637702]; //Position at Cal Poly Slo


  return(

    <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={markers}
    icon = {musicnote}>
      <Popup>
        Beat <br /> Dropped!
      </Popup>
  </Marker>
</MapContainer>


  );

}

export default Map;

