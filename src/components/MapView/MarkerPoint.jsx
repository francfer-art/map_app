import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MarkerPoint = ({ position, text }) => {
  return (
    <Marker position={position} icon={redIcon}>
      <Popup>{text}</Popup>
    </Marker>
  );
};

export default MarkerPoint;
