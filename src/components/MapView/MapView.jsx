// components/MapView/MapView.jsx
import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { getApproxUserLocation } from "../../utils/InitialLocation";
import MapUpdater from "./MapUpdater";
import RouteLine from "./RouteLine";
import { fetchParkingNearDestination } from "../../utils/fetchParkingNearDestination";
import MarkerPoint from "./MarkerPoint";

const MapView = ({ searchData }) => {
  const [center, setCenter] = useState([0, 0]);
  const [parkingSpots, setParkingSpots] = useState([]);
  const origin = searchData?.origin;
  const destination = searchData?.destination;

  useEffect(() => {
    getApproxUserLocation().then((location) => {
      if (location) setCenter([location.lat, location.lng]);
    });
  }, []);

  useEffect(() => {
    console.log("searchData:", searchData);
    fetchParkingNearDestination(destination, 2000).then((parkingSpots) => {
      console.log("Parking spots near destination:", parkingSpots);
      setParkingSpots(parkingSpots);
    });
  }, [searchData]);

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
            console.log(
              `📍 Distancia: ${distanceKm} km, Tiempo estimado: ${timeMin} min`
            );
            // Aquí podrías hacer algo con routeCoords si lo necesitas
          }}
        />
      )}
      {parkingSpots.map((spot, index) => (
        <MarkerPoint
          key={index}
          position={[spot.lat, spot.lng]}
          text={spot.name}
        />
      ))}
    </MapContainer>
  );
};

export default MapView;
