// components/MapView/MapView.jsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { getApproxUserLocation } from "../../utils/InitialLocation";
import MapUpdater from "./MapUpdater";
import RouteLine from "./RouteLine";

const MapView = ({ searchData }) => {
  const [center, setCenter] = useState([0, 0]);
  const origin = searchData?.origin;
  const destination = searchData?.destination;

  useEffect(() => {
    getApproxUserLocation().then((location) => {
      if (location) setCenter([location.lat, location.lng]);
    });
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {center && <MapUpdater center={center} />}
      {origin && destination && (
        <RouteLine
          from={origin}
          to={destination}
          onRouteInfo={({ distanceKm, timeMin }) => {
            console.log(`📍 Distancia: ${distanceKm} km, Tiempo estimado: ${timeMin} min`);
            // Aquí podrías hacer algo con routeCoords si lo necesitas
          }}
        />
      )}
    </MapContainer>
  );
};

export default MapView;
