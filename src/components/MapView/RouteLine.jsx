// components/RouteLine.jsx
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";

const RouteLine = ({ from, to, onRouteInfo }) => {
  const map = useMap();

  useEffect(() => {
    if (!from || !to) return;

    const control = L.Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      routeWhileDragging: true,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      lineOptions: {
        styles: [{ color: "#6FA1EC", weight: 4 }],
      },
    }).addTo(map);

    control.on("routesfound", function (e) {
      const route = e.routes[0];
      const distanceKm = (route.summary.totalDistance / 1000).toFixed(2);
      const timeMin = Math.round(route.summary.totalTime / 60);

      if (onRouteInfo) {
        const routeCoords = route.coordinates.map((coord) => ({
          lat: coord.lat,
          lng: coord.lng,
        }));
        onRouteInfo({ distanceKm, timeMin, routeCoords });
      }
    });
    return () => map.removeControl(control);
  }, [from, to, map]);

  return null;
};

export default RouteLine;
